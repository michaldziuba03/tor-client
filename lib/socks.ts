import net, { Socket, isIP } from 'net';
import { SocksOptions } from './types';
import { TorException } from './exceptions';

const socksVersion = 0x05; // SOCKS v5
const authMethods = 0x01; // NUMBER OF SUPPORTED AUTH METHODS
const noPassMethod = 0x00; // PREFERED AUTH METHOD BY DEFAULT (no password)

export class Socks {
    readonly socket: Socket;

    constructor(options: SocksOptions) {
        const { socksHost, socksPort } = options;

        this.socket = net.connect({
            host: socksHost,
            port: socksPort,
        });
    }

    async connect(host: string, port: number) {
        await this.auth();
        return this.request(host, port);
    }

    auth() {
        const request = [socksVersion, authMethods, noPassMethod];
        const buffer = Buffer.from(request);

        return new Promise<boolean>((resolve, reject) => {
            this.socket.once('data', chunk => {
                if (chunk.length !== 2) {
                    const err = new TorException('Invalid SOCKS response size');
                    return reject(err);
                }
    
                if (chunk[0] !== socksVersion) {
                    const err = new TorException('Invalid SOCKS version in response');
                    return reject(err);
                }
    
                if (chunk[1] !== noPassMethod) {
                    const err = new TorException('Unexpected SOCKS authentication method');
                    return reject(err);
                }
                
                resolve(true);
            });

            this.socket.write(buffer);
        });
    }

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
                    const errorMessage = getSocksError(chunk[1]);
                    err = new TorException(errorMessage);
                    
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

    parseHost(host: string) {
        const type = isIP(host);

        if (type === 4) {
            const hostType = 0x01;  // 0x01 means IPv4
            const buffer = Buffer.from(host.split('.').map(octet => parseInt(octet, 10)));
            return [hostType, ...buffer];
        } else if (type === 6) {
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
}

function getSocksError(status: number) {
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
