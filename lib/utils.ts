import { IncomingMessage } from "http";
import { HttpResponse, TorDownloadOptions } from "./types";
import { randomBytes } from 'crypto';
import { join, isAbsolute } from 'path';

export function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}

function generateFilename(pathname: string) {
    const filename = pathname.split('/').pop();
    if (!filename || filename === '') {
        return `${Date.now()}${randomBytes(6).toString('hex')}`;
    }

    return `${filename}`;
}

export function getPath(options: TorDownloadOptions, pathname: string) {
    const filename = options.filename || generateFilename(pathname);
    const dir = options.dir || './';

    if (isAbsolute(dir)) {
        return join(dir, filename);
    }

    return join(
        process.cwd(),
        dir, 
        filename
    );
}

export function dnsLeakDefender(
    hostname: string, 
    options: any, 
    cb: any,
 ) {
    throw new Error(`Blocked DNS lookup for: ${hostname}`);
}