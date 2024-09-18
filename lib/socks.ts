import net, { Socket, isIP } from 'net';
import { SocksOptions } from './types';
import { TorException } from './exceptions';

const IPv4 = 4;
const IPv6 = 6;

const socksVersion = 0x05; // SOCKS v5
const authMethods = 0x01; // NUMBER OF SUPPORTED AUTH METHODS
const noPassMethod = 0x00; // PREFERED AUTH METHOD BY DEFAULT (no password)

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
            timeout: options.timeout,
        });

        return new Promise<Socks>((resolve, reject) => {
            socket.on('error', (err: Error) => {
                reject(err);
            });

            socket.on('timeout', () => {
                const err = new Error('SOCKS5 connection attempt timed out');
                socket.destroy(err);
            });
    
            socket.on('connect', () => {
                socket.setTimeout(0);
                resolve(new Socks(socket));
            })
        })
    }

    /**
     * All content will be proxied after success of this function.
     * 
     * @param {string} host - destination hostname (domain or IP address)
     * @param {number} port - destination port
     * @throws {TorException} on connection failure
     */
    async proxy(host: string, port: number) {
        await this.auth();
        return this.request(host, port);
    }

    /**
     * Perform `initial greeting` to the SOCKS5 proxy server.
     * 
     * @throws {TorException} on connection failure
     */
    auth() {
        const request = [socksVersion, authMethods, noPassMethod];
        const buffer = Buffer.from(request);

        return new Promise<boolean>((resolve, reject) => {
            this.socket.once('data', chunk => {
                if (chunk.length !== 2) {
                    const err = new TorException('Unexpected SOCKS response size');
                    return reject(err);
                }
    
                if (chunk[0] !== socksVersion) {
                    const err = new TorException('Invalid SOCKS version in response');
                    return reject(err);
                }
    
                // TODO: add support for more auth methods
                if (chunk[1] !== noPassMethod) {
                    const err = new TorException('Unexpected SOCKS authentication method');
                    return reject(err);
                }
                
                resolve(true);
            });

            this.socket.write(buffer);
        });
    }

    /**
     * Performs `connection request` to the SOCKS5 proxy server.
     * 
     * @param {string} host - destination hostname (domain or IP address)
     * @param {number} port - destination port
     * @throws {TorException} on connection failure
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
            this.socket.once('data', chunk => {
                let err;

                if (chunk[0] !== socksVersion) {
                    err =  new TorException('Invalid SOCKS version in response');
                }
                else if (chunk[1] !== 0x00) {
                    const msg = this.getSocksError(chunk[1]);
                    err = new TorException(msg);
                    
                }
                else if (chunk[2] !== reserved) {
                    err = new TorException('Invalid SOCKS response shape');
                }

                if (err) {
                    this.socket.destroy(err);
                    return reject(err);
                }
    
                resolve(this.socket);
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

    private getSocksError(status: number) {
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
