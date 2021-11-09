import { IncomingMessage } from "http";
import { HttpResponse } from "./types";

export function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}