import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "./constants";
import { HttpAgent, HttpsAgent } from "./agent";

import * as http from 'http';
import * as https from 'https';

export interface IRequestOptions {
    method: HttpMethod;
    data?: any;
    headers: { [x: string]: string } | {};
}

export interface TorRequestOptions {
    headers?: object;
}

export interface TorDownloadOptions extends TorRequestOptions {
    filename?: string;
    dir?: string;
}

export interface SendOptions {
    url: string;
    requestOptions: IRequestOptions;
    client: typeof http | typeof https;
}

export interface HttpResponse {
    status: number;
    headers: IncomingHttpHeaders;
    data: string;
}

export interface TorClientOptions {
    socksHost?: string;
    socksPort?: number;
}

export type SocksAgent =  HttpAgent | HttpsAgent;

export interface SocksOptions {
    socksHost: string;
    socksPort: number;
}