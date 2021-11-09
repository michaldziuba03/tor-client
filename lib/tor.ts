import { Socket } from "net";
import { TLSSocket } from 'tls';
import { HttpAgent, HttpsAgent } from "./agent";
import { HttpClient } from "./http";
import { Socks } from "./socks";
import { TorClientOptions } from "./types";

function createAgent(protocol: string, socket: Socket) {
    if (protocol === 'http:') {
        return new HttpAgent({ socksSocket: socket });
    }

    const tlsSocket = new TLSSocket(socket);
    return new HttpsAgent({ socksSocket: tlsSocket });
}

const defaultOptions: TorClientOptions = {
    socksHost: 'localhost',
    socksPort: 9050,
}

export class TorClient {
    private readonly http = new HttpClient();
    private readonly options: TorClientOptions;

    constructor(options: TorClientOptions = defaultOptions) {
        this.options = options;
    }

    async get(url: string) {
        const urlObj = new URL(url);
        let port =  urlObj.protocol === 'http:' ? 80 : 443;
        if (urlObj.port || urlObj.port !== '') {
            port = parseInt(urlObj.port);
        }

        const socks = new Socks(
            this.options.socksHost as string, 
            this.options.socksPort as number
        );

        const socket = await socks.connect(urlObj.host, port) as Socket;
        const agent = createAgent(urlObj.protocol, socket);
        return this.http.get(url, agent);
    }

    async torcheck() {
        const result = await this.get('https://check.torproject.org/');
        return result.data.includes('Congratulations. This browser is configured to use Tor');
    }
}