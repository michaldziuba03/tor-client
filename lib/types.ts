import { IncomingHttpHeaders } from "http";
import { HttpAgent, HttpsAgent } from "./agent";

export interface TorRequestOptions {
    headers?: object;
    timeout?: number;
}

export interface TorDownloadOptions extends TorRequestOptions {
    filename?: string;
    dir?: string;
}

export interface TorClientOptions {
    socksHost?: string;
    socksPort?: number;
}

export interface HttpResponse<TResponseData = string> {
    status: number;
    headers: IncomingHttpHeaders;
    data: TResponseData;
}

export interface HttpOptions {
    headers?: object;
    method?: string;
    data?: string;
    agent?: SocksAgent;
    timeout?: number;
}

export interface DownloadOptions extends HttpOptions {
    path: string;
}

export type SocksAgent =  HttpAgent | HttpsAgent;
