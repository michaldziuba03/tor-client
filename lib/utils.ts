import { IncomingMessage } from "http";
import { HttpResponse } from "./types";
import { randomBytes } from 'crypto';

export function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}

export function generateFilename(pathname: string) {
    const filename = pathname.split('/').pop();
    if (!filename || filename === '') {
        return `./${Date.now()}${randomBytes(6).toString('hex')}`;
    }

    return `./${filename}`;
}