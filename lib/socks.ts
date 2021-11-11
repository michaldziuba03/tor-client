import net, { Socket, isIP } from 'net';
import { getSocksError } from './constants';
import { SocksOptions } from './types';

const socksVersion = 0x05;
const authMethods = 0x01;
const noPassMethod = 0x00;

export class Socks {
    readonly socket: Socket;

    constructor(options: SocksOptions) {
        const { socksHost, socksPort } = options;

        this.socket = net.connect({
            host: socksHost,
            port: socksPort,
        });
    }

    connect(host: string, port: number) {
        const request = [socksVersion, authMethods, noPassMethod];

        return new Promise<Socket>((resolve, reject) => {
            this.socket.once('data', chunk => {
                if (chunk.length !== 2) {
                    throw new Error('Invalid SOCKS response size');
                }
    
                if (chunk[0] !== socksVersion) {
                    throw new Error('Invalid SOCKS version in response');
                }
    
                if (chunk[1] !== noPassMethod) {
                    throw new Error('Unexpected SOCKS authentication method');
                }
                
                this.request(host, port, resolve, reject);
            });

            this.socket.once('error', (err) => reject(err));
            this.socket.write(Buffer.from(request));
        })
        
    }

    private request(host: string, port: number, resolve: any, reject: any) {
        const cmd = 0x01; // TCP/IP stream connection;
        const reserved = 0x00; // reserved byte;
        const parsedHost = parseHostname(host); // parsed host type, host length and host value
        const request = [socksVersion, cmd, reserved, ...parsedHost];

        request.length += 2;
        const buffer = Buffer.from(request);
        buffer.writeUInt16BE(port, buffer.length - 2);

        this.socket.once('data', chunk => {
            if (chunk[0] !== socksVersion) {
                throw new Error('Invalid SOCKS version in response');
            }

            if (chunk[1] !== 0x00) {
                const errorMessage = getSocksError(chunk[1]);
                throw new Error(errorMessage);
            }

            if (chunk[2] !== reserved) {
                throw new Error('Invalid SOCKS response shape');
            }

            resolve(this.socket);
        });

        this.socket.write(buffer);
    }
}

function parseHostname(host: string) {
    const buffer = Buffer.from(host)
    const len = buffer.length;
    const type = isIP(host);
    if (type !== 0) {
        throw new Error('IP hostname is not supported yet');
    }

    const parsedHostname = buffer.toJSON().data
    const request = [0x03, len, ...parsedHostname];

    return request;
}