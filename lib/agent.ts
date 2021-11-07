import { Agent, AgentOptions } from 'http';
import { Socks } from './socks';

interface SocksOptions extends AgentOptions {
    host: string;
    port: number;
}

export class SocksAgent extends Agent {
    constructor(options: SocksOptions) {
        super(options);
    }

    createConnection(options: any) {
        const socks = new Socks(options.host, options.port);
        socks.connect(options.hostname, 80);
        
        return socks;
    }
}