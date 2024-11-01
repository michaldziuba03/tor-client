import { Agent, AgentOptions } from 'http';
import { Agent as AgentS, AgentOptions as AgentOptionsS } from 'https';
import { Socket } from 'net';

interface SocksOptions extends AgentOptions, AgentOptionsS {
    socksSocket: Socket;
}

export class HttpAgent extends Agent {
    private socksSocket: Socket;

    constructor(options: SocksOptions) {
        super(options);
        this.socksSocket = options.socksSocket;
    }

    createConnection() {
        return this.socksSocket;
    }
}

export class HttpsAgent extends AgentS {
    private socksSocket: Socket;

    constructor(options: SocksOptions) {
        super(options);
        this.socksSocket = options.socksSocket;
    }

    createConnection() {
        return this.socksSocket;
    }
}
