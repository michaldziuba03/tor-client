import { createWriteStream } from 'fs';
import http from 'http';
import https, { RequestOptions } from 'https';
import { ALLOWED_PROTOCOLS } from './constants';
import { DownloadOptions, HttpOptions, HttpResponse } from './types';
import { headers, HttpMethod, MimeTypes } from './constants';
import { formParser } from './parsers';
import { buildResponse, dnsLeakDefender } from './utils';


export class HttpClient {
    private getClient(protocol: string) {
        if (protocol === 'http:') return http;

        return https;
    }

    private createRequestOptions(url: string, options: HttpOptions) {
        const { protocol } = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(protocol)) {
            throw new Error('Invalid HTTP protocol in url');
        }

        if (!options.agent) {
            throw new Error('HttpAgent is required for TOR requests');
        }

        const client = this.getClient(protocol);
        const requestOptions: RequestOptions = {
            headers: { ...headers, ...options.headers },
            method: options.method,
            agent: options.agent,
            lookup: dnsLeakDefender,
        }

        return { client, requestOptions }
    }

    request(url: string, options: HttpOptions = {}) {
        const { client, requestOptions } = this.createRequestOptions(url, options);

        return new Promise<HttpResponse>((resolve, reject) => {
            const req = client.request(url, requestOptions, res => {
                let data = '';
                
                res.on('data', chunk => data += chunk);
                res.on('error', reject);
                res.on('close', () => {
                    const response = buildResponse(res, data);
                    resolve(response);

                });
            });

            if (options.timeout) req.setTimeout(options.timeout);

            req.on('error', reject);
            req.on('timeout', () => reject(new Error('Http request timeout')));

            if (options.data) {
                req.write(options.data);
            }

            req.end();
        });
    }

    download(url: string, options: DownloadOptions) {
        const { client, requestOptions } = this.createRequestOptions(url, options);

        return new Promise<string>((resolve, reject) => {
            const req = client.request(url, requestOptions, res => {
                const fileStream = createWriteStream(options.path);
                fileStream.on('error', reject);

                res.on('data', chunk => fileStream.write(chunk));
                res.on('error', (err) => {
                    fileStream.end();
                    reject(err);
                });

                res.on('close', () => {
                    fileStream.end();
                    resolve(options.path);
                });
            });

            if (options.timeout) req.setTimeout(options.timeout);
            req.on('error', reject);
            req.on('timeout', () => reject(new Error('Download timeout')));
            req.end();
        });
    }

    get(url: string, options: HttpOptions = {}) {
        return this.request(url, {
            ...options,
            method: HttpMethod.GET,
        });
    }

    post(url: string, data: object, options: HttpOptions = {}) {
        const dataString = formParser(data as Record<string, string>);
        return this.request(url, { 
            agent: options.agent,
            timeout: options.timeout,
            method: HttpMethod.POST, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
                ...options.headers,
            },
        });
    }
}