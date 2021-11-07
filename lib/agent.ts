import { Agent, AgentOptions, ClientRequest } from 'http';
import { RequestOptions } from 'https';
import { Socks } from './socks';

interface SocksOptions extends AgentOptions {
    socksHost: string;
    socksPort: number;
}

export class SocksAgent extends Agent {
    private readonly socks: Socks;

    constructor(options: SocksOptions) {
        super(options);
        this.socks = new Socks(options.socksHost, options.socksPort);
    }

    async callback(req: ClientRequest, options: RequestOptions) {
        let { host, port } = options;

        if (!host) {
            throw new Error('Host not definied');
        }

        if (typeof port === 'string') {
            port = parseInt(port);
        }

        if (!port) {
            port = 80;
        }

        this.socks.connect(host, port);
    }
}