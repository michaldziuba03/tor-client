import { Socket } from "net";
import { SocksAgent, SocksAgentS } from "./agent";
import { HttpClient } from "./http";
import { Socks } from "./socks";

function createAgent(protocol: string, socket: Socket) {
    if (protocol === 'http:') {
        return new SocksAgent({ socksSocket: socket});
    }

    return new SocksAgentS({ socksSocket: socket });
}

export class TorClient {
    private readonly http = new HttpClient();

    async get(url: string) {
        const urlObj = new URL(url);
        let port =  urlObj.protocol === 'http:' ? 80 : 443;
        if (urlObj.port || urlObj.port !== '') {
            port = parseInt(urlObj.port);
        }
        const socks = new Socks('localhost', 9050);
        const socket = await socks.connect(urlObj.host, port) as Socket;
        const agent = createAgent(urlObj.protocol, socket);
        return this.http.get(url, agent);
    }
}