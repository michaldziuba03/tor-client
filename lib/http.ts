import { createWriteStream } from 'fs';
import http from 'http';
import https, { RequestOptions } from 'https';
import qs from 'querystring';

import { ALLOWED_PROTOCOLS } from './constants';
import { DownloadOptions, HttpOptions, HttpResponse } from './types';
import { headers, HttpMethod, MimeTypes } from './constants';
import { buildResponse, preventDNSLookup } from './utils';
import { TorHttpException } from './exceptions';

/**
 * Wrapper around `http` module for making HTTP requests over Tor.
 */
export class HttpClient {
    private getClient(protocol: string) {
        if (protocol === 'http:') return http;

        return https;
    }

    private createRequestOptions(url: string, options: HttpOptions) {
        const { protocol } = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(protocol)) {
            throw new TorHttpException('Invalid HTTP protocol in URL');
        }

        if (!options.agent) {
            throw new TorHttpException('HttpAgent is required for TOR requests');
        }

        const client = this.getClient(protocol);
        const requestOptions: RequestOptions = {
            headers: { ...headers, ...options.headers },
            method: options.method,
            agent: options.agent,
            lookup: preventDNSLookup,
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
            req.on('timeout', () => reject(new TorHttpException('Http request timeout')));

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
                res.pipe(fileStream);

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
            req.on('timeout', () => reject(new TorHttpException('Download timeout')));
            req.end();
        });
    }

    delete(url: string, options: HttpOptions = {}) {
        return this.request(url, {
            ...options,
            method: HttpMethod.DELETE,
        });
    }

    get(url: string, options: HttpOptions = {}) {
        return this.request(url, {
            ...options,
            method: HttpMethod.GET,
        });
    }

    post(url: string, data: object, options: HttpOptions = {}) {
        const dataString = qs.stringify(data as Record<string, string>);
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

    put(url: string, data: object, options: HttpOptions = {}) {
        const dataString = qs.stringify(data as Record<string, string>);
        return this.request(url, { 
            agent: options.agent,
            timeout: options.timeout,
            method: HttpMethod.PUT, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
                ...options.headers,
            },
        });
    }

    patch(url: string, data: object, options: HttpOptions = {}) {
        const dataString = qs.stringify(data as Record<string, string>);
        return this.request(url, { 
            agent: options.agent,
            timeout: options.timeout,
            method: HttpMethod.PATCH, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
                ...options.headers,
            },
        });
    }
}
