import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "./constants";

export interface SendOptions {
    method: HttpMethod;
    data?: any;
    headers?: object;
}

export interface HttpResponse {
    status: number;
    headers: IncomingHttpHeaders;
    data: string;
}