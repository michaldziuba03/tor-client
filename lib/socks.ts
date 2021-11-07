import net, { Socket, isIP } from 'net';
import { getSocksError } from './constants';

const socksVersion = 0x05;
const authMethods = 0x01;
const authMethod = 0x00;

export class Socks {
    readonly socket: Socket;

    constructor(socksHost: string, socksPort: number) {
        this.socket = net.connect({
            host: socksHost,
            port: socksPort,
        });
    }

    connect(host: string, port: number) {
        const authRequest = [socksVersion, authMethods, authMethod];

        this.socket.once('data', chunk => {
            if (chunk.length !== 2) {
                throw new Error('Invalid SOCKS response size');
            }

            if (chunk[0] !== socksVersion) {
                throw new Error('Invalid SOCKS version in response');
            }

            if (chunk[1] !== authMethod) {
                throw new Error('Unexpected SOCKS authentication method');
            }

            this.request(host, port);
        });

        this.socket.write(Buffer.from(authRequest));
    }

    private request(host: string, port: number) {
        const cmd = 0x01; // TCP/IP stream connection;
        const reserved = 0x00; // reserved byte;
        const parsedHost = parseHost(host);
        const request = [socksVersion, cmd, reserved, parsedHost];
        parseDomainName(host, request);

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
        });

        this.socket.write(buffer);
    }
}

function parseHost(host: string) {
    const type = isIP(host);

    switch (type) {
        case 0:;
            return 0x03;
        case 4:
            return 0x01;
        case 6:
            return 0x04;
        default:
            throw Error('Invalid destination host');
    }
}

function parseDomainName(host: string, request: number[]) {
    var buffer = Buffer.from(host), l = buffer.length;
	request.push(l);

	for (let i = 0; i < l; i++) {
		request.push(buffer[i]);
	}
}