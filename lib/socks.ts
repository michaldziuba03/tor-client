import net, { Socket, isIP } from 'net';

const socksVersion = 0x05;
const authMethods = 0x01;
const authMethod = 0x00;

export class Socks {
    readonly socket: Socket;

    constructor(host: string, port: number) {
        this.socket = net.connect({
            host,
            port,
        });

        this.auth();
    }

    auth() {
        const authRequest = [socksVersion, authMethods, authMethod];

        this.socket.once('data', (chunk: Buffer) => {
            if (chunk.length !== 2) {
                throw new Error('Invalid SOCKS response size');
            }

            if (chunk[0] !== socksVersion) {
                throw new Error('Invalid SOCKS version in response');
            }

            if (chunk[1] !== authMethod) {
                throw new Error('Unexpected SOCKS authentication method');
            }
        });

        this.socket.write(Buffer.from(authRequest));
    }

    request(host: string, port: number) {
        const cmd = 0x01; // TCP/IP stream connection;
        const reserved = 0x00; // reserved byte;
        const request = [socksVersion, cmd, reserved, ];
    }
}

function parseHost(host: string) {
    const type = isIP(host);

    switch (type) {
        case 0:
            const domainBuff = parseDomainName(host);
            return [0x03, ...domainBuff];
        case 4:
            return [0x01];
        case 6:
            return [0x04];
        default:
            throw Error('Invalid destination host');
    }
}

function parseDomainName(host: string) {
    const buff = []

    buff.push(host.length);
    for(var i=0; i < host.length; i++) {
      var c = host.charCodeAt(i);
      buff.push(c);
    }

    return buff;
  }

try {
    const socks = new Socks('localhost', 9050);
    setTimeout(() => socks.socket.destroy(), 20000);
} catch (err) {
    if (err instanceof Error) {
        console.log(err.message);
    }
    else console.log(err);
}
