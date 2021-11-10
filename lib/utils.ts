import { IncomingMessage } from "http";
import { HttpResponse } from "./types";
import { randomBytes } from 'crypto';

export function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}

let localSequence = 0;

export function randomFilename() {
    const random = randomBytes(12).toString('hex');
    const timestamp = Date.now();
    const sequence = localSequence;

    const finalFilename = `./${sequence}${timestamp}${random}`;
    localSequence++;

    return finalFilename;
}