import { Socket } from "net";
import { TLSSocket } from 'tls';
import { HttpAgent, HttpsAgent } from "./agent";
import { HttpClient } from "./http";
import { Socks } from "./socks";
import { TorClientOptions, TorDownloadOptions, TorRequestOptions } from "./types";
import { getPath } from "./utils";

function createAgent(protocol: string, socket: Socket) {
    if (protocol === 'http:') {
        return new HttpAgent({ socksSocket: socket });
    }

    const tlsSocket = new TLSSocket(socket);
    return new HttpsAgent({ socksSocket: tlsSocket });
}

export class TorClient {
    private readonly http = new HttpClient();
    private readonly options: TorClientOptions;

    constructor(options: TorClientOptions = {}) {
        this.options = options;
    }

    private getDestination(url: string) {
        const urlObj = new URL(url);
        let port =  urlObj.protocol === 'http:' ? 80 : 443;
        if (urlObj.port || urlObj.port !== '') {
            port = parseInt(urlObj.port);
        }

        return { port, host: urlObj.host, protocol: urlObj.protocol, pathname: urlObj.pathname }
    }

    private connectSocks(host: string, port: number) {
        const socksOptions = {
            socksHost: this.options.socksHost || '127.0.0.1',
            socksPort: this.options.socksPort || 9050,
        }
        const socks = new Socks(socksOptions);

        return socks.connect(host, port);
    }

    async download(url: string, options: TorDownloadOptions = {}) {
        const { protocol, host, port, pathname } = this.getDestination(url);
        
        const path = getPath(options, pathname);
        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);

        return this.http.download(url, {
            path,
            agent,
            headers: options.headers,
            timeout: options.timeout,
        });
    }

    async get(url: string, options: TorRequestOptions = {}) {
        const { protocol, host, port } = this.getDestination(url);

        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);

        return this.http.get(url, {
            agent,
            headers: options.headers,
            timeout: options.timeout,
        });
    }

    async post(url: string, data: object, options: TorRequestOptions = {}) {
        const { protocol, host, port } = this.getDestination(url);

        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);
        
        return this.http.post(url, data, {
            agent,
            headers: options.headers,
            timeout: options.timeout,
        });
    }

    async torcheck(options?: TorRequestOptions) {
        const result = await this.get('https://check.torproject.org/', options);
        if (!result.status || result.status !== 200) {
            throw new Error(`Network error with check.torproject.org, status code: ${result.status}`);
        }

        return result.data.includes('Congratulations. This browser is configured to use Tor');
    }
}