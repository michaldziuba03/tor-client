import { Agent, AgentOptions } from 'http';
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

    createConnection(options: any) {
        console.log(options.host, options.port);
        this.socks.connect(options.host, options.port);
    }
}