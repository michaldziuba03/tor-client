/* Copyright (c) Michał Dziuba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import net, { Socket, isIP } from 'net';

const IPv4 = 4;
const IPv6 = 6;

const socksVersion = 0x05; // SOCKS v5
const authMethods = 0x01; // NUMBER OF SUPPORTED AUTH METHODS
const noPassMethod = 0x00; // PREFERED AUTH METHOD BY DEFAULT (no password)

export interface SocksOptions {
    socksHost: string;
    socksPort: number;
    keepAlive?: boolean | undefined;
    noDelay?: boolean | undefined;
    timeout?: number | undefined;
}

/**
 * Handles SOCKS5 protocol
 */
export class Socks {
    constructor(public readonly socket: Socket) {}

     /**
     * Connect to the SOCKS5 proxy server.
     * @throws {Error} on connection failure
     */
    static connect(options: SocksOptions): Promise<Socks> {
        const socket = net.connect({
            host: options.socksHost,
            port: options.socksPort,
            keepAlive: options.keepAlive,
            noDelay: options.noDelay,
            timeout: options.timeout,
        });

        return new Promise<Socks>((resolve, reject) => {
            const onError = (err: Error) => {
                socket.destroy(); // safe to call many times
                reject(err);
            }

            const onTimeout = () => {
                const err = new Error('SOCKS5 connection attempt timed out');
                socket.destroy(err); // will notify error listener to reject
            }

            socket.once('error', onError);
            socket.once('timeout', onTimeout);
            socket.once('connect', () => {
                socket.setTimeout(0);
                socket.removeListener('error', onError);
                socket.removeListener('timeout', onTimeout);
                resolve(new Socks(socket));
            });
        });
    }

    /**
     * All content will be proxied after success of this function.
     * 
     * @param {string} host - destination hostname (domain or IP address)
     * @param {number} port - destination port
     * @throws {Error} on connection failure
     */
    async proxy(host: string, port: number) {
        await this.initialize();
        return this.request(host, port);
    }

    /**
     * Perform `initial greeting` to the SOCKS5 proxy server.
     * 
     * @throws {Error} on connection failure
     */
    initialize() {
        const request = [socksVersion, authMethods, noPassMethod];
        const buffer = Buffer.from(request);

        return new Promise<boolean>((resolve, reject) => {
            // without close handler, Node.js app crashes silently.
            const onClose = () => {
                reject(new Error('SOCKS5 dropped connection'));
            }

            const onError = (err: Error) => {
                this.socket.removeListener('close', onClose);
                this.socket.destroy();
                reject(err);
            }

            this.socket.once('close', onClose);
            this.socket.once('error', onError);
            this.socket.once('data', chunk => {
                let err;

                if (chunk.length !== 2) {
                    err = new Error('Unexpected SOCKS response size');
                }
                else if (chunk[0] !== socksVersion) {
                    err = new Error('Invalid SOCKS version in response');
                }
                // TODO: add support for more auth methods
                else if (chunk[1] !== noPassMethod) {
                    err = new Error('Unexpected SOCKS authentication method');
                }

                if (err) {
                    this.socket.destroy(err);
                    return;
                }
                
                this.socket.removeListener('error', onError);
                this.socket.removeListener('close', onClose);
                return resolve(true);
            });

            this.socket.write(buffer);
        });
    }

    /**
     * Performs `connection request` to the SOCKS5 proxy server.
     * 
     * @param {string} host - destination hostname (domain or IP address)
     * @param {number} port - destination port
     * @throws {Error} on connection failure
     */
    request(host: string, port: number) {
        const cmd = 0x01; // TCP/IP stream connection;
        const reserved = 0x00; // reserved byte;
        const parsedHost = this.parseHost(host); // parsed host type, host length and host value
        const request = [socksVersion, cmd, reserved, ...parsedHost];

        request.length += 2;
        const buffer = Buffer.from(request);
        buffer.writeUInt16BE(port, buffer.length - 2);

        return new Promise<Socket>((resolve, reject) => {
            const onClose = () => {
                reject(new Error('SOCKS5 dropped connection'));
            }

            const onError = (err: Error) => {
                this.socket.removeListener('close', onClose);
                this.socket.destroy();
                reject(err);
            }

            this.socket.once('error', onError);
            this.socket.once('close', onClose);
            this.socket.once('data', chunk => {
                let err;

                if (chunk[0] !== socksVersion) {
                    err =  new Error('Invalid SOCKS version in response');
                }
                else if (chunk[1] !== 0x00) {
                    const msg = this.mapError(chunk[1]);
                    err = new Error(msg);
                    
                }
                else if (chunk[2] !== reserved) {
                    err = new Error('Invalid SOCKS response shape');
                }

                if (err) {
                    this.socket.destroy(err);
                    return;
                }
                
                this.socket.removeListener('error', onError);
                this.socket.removeListener('close', onClose);
                return resolve(this.socket);
            });
    
            this.socket.write(buffer);
        });
    }

    private parseHost(host: string) {
        const type = isIP(host);

        if (type === IPv4) {
            const hostType = 0x01;  // 0x01 means IPv4
            const buffer = Buffer.from(host.split('.').map(octet => parseInt(octet, 10)));
            return [hostType, ...buffer];
        } else if (type === IPv6) {
            const hostType = 0x04;  // 0x04 means IPv6
            const buffer = Buffer.from(host.split(':').map(hex => parseInt(hex, 16)));
            return [hostType, ...buffer];
        } else {
            const buffer = Buffer.from(host);
            const hostType = 0x03;  // 0x03 means domain name
            const len = buffer.length;
            return [hostType, len, ...buffer];
        }
    }

    private mapError(status: number) {
        switch(status) {
            case 0x01:
                return 'General failure';
            case 0x02:
                return 'Connection not allowed by ruleset';
            case 0x03:
                return 'Network unreachable';
            case 0x04:
                return 'Host unreachable';
            case 0x05:
                return 'Connection refused by destination host';
            case 0x06:
                return 'TTL expired';
            case 0x07:
                return 'Command not supported / protocol error';
            case 0x08:
                return 'Address type not supported';
            default:
                return 'Unknown SOCKS response status';
        }
    }
}
