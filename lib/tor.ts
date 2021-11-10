import { Socket } from "net";
import { TLSSocket } from 'tls';
import { HttpAgent, HttpsAgent } from "./agent";
import { headers, HttpMethod } from "./constants";
import { HttpClient } from "./http";
import { Socks } from "./socks";
import { TorClientOptions, TorDownloadOptions, TorRequestOptions } from "./types";

import * as https from 'https';
import * as http from 'http';
import { generateFilename } from "./utils";
import { join,  } from 'path';

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

    private getDestination(url: string) {
        const urlObj = new URL(url);
        let port =  urlObj.protocol === 'http:' ? 80 : 443;
        if (urlObj.port || urlObj.port !== '') {
            port = parseInt(urlObj.port);
        }

        return { port, host: urlObj.host, protocol: urlObj.protocol, pathname: urlObj.pathname }
    }

    private connectSocks(host: string, port: number) {
        const socks = new Socks(
            this.options.socksHost as string, 
            this.options.socksPort as number
        );

        return socks.connect(host, port);
    }

    async download(url: string, options: TorDownloadOptions = {}) {
        const { protocol, host, port, pathname } = this.getDestination(url);
        
        const filename = options.filename || generateFilename(pathname);
        const dir = options.dir || './';

        const path = join(
            process.cwd(),
            dir, 
            filename
        );
        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);
        const client = protocol === 'http:' ? http : https;

        return this.http.download({
            url,
            client,
            requestOptions: { 
                method: HttpMethod.GET, 
                headers: { ...headers, ...options.headers },
            },
        }, agent, path);
    }

    async get(url: string, options?: TorRequestOptions) {
        const { protocol, host, port } = this.getDestination(url);

        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);

        return this.http.get(url, agent, options);
    }

    async post(url: string, data: object, options?: TorRequestOptions) {
        const { protocol, host, port } = this.getDestination(url);

        const socket = await this.connectSocks(host, port);
        const agent = createAgent(protocol, socket);

        return this.http.post(url, data, agent, options);
    }

    async torcheck(options?: TorRequestOptions) {
        const result = await this.get('https://check.torproject.org/', options);
        if (!result.status || result.status !== 200) {
            throw new Error(`Network error with check.torproject.org, status code: ${result.status}`);
        }

        return result.data.includes('Congratulations. This browser is configured to use Tor');
    }
}