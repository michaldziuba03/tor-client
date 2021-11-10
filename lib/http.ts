import http, { RequestOptions } from 'http';
import https from 'https';
import { ALLOWED_PROTOCOLS, headers, HttpMethod, MimeTypes } from './constants';
import { formParser } from './parsers';
import { HttpResponse, SendOptions, SocksAgent, IRequestOptions, TorRequestOptions } from './types';
import { buildResponse, generateFilename } from './utils';
import { createWriteStream } from 'fs';

export class HttpClient {
    private sendRequest(options: SendOptions, agent: SocksAgent) {
        const { url, client, requestOptions } = options;
        return new Promise<HttpResponse>((resolve, reject) => {
            const options: RequestOptions = {
                method: requestOptions.method,
                headers: { ...headers, ...requestOptions.headers },
                agent,
            }

            const request = client.request(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('error', (err) => {
                    reject(err);
                });

                res.on('close', () => {
                    const response = buildResponse(res, data);
                    resolve(response);
                });
            });

            if (requestOptions.data) {
                request.write(requestOptions.data);
            }

            request.end();

            request.on('timeout', () => reject(new Error('Http request timeout')));
            request.on('error', (err) => reject(err));
        });
    }

    download(options: SendOptions, agent: SocksAgent, path: string) {
        const { url, client, requestOptions } = options;
        return new Promise<string>((resolve, reject) => {
            const options: RequestOptions = {
                method: HttpMethod.GET,
                headers: { ...headers, ...requestOptions.headers },
                agent,
            }

            const request = client.request(url, options, (res) => {
                const fileStream = createWriteStream(path);

                res.on('data', (chunk) => {
                    fileStream.write(chunk);
                });

                res.on('error', (err) => {
                    fileStream.end();
                    reject(err);
                });

                fileStream.on('error', (err) => reject(err));

                res.on('close', () => {
                    fileStream.end();
                    resolve(path);
                });
            });

            request.end();

            request.on('timeout', () => reject(new Error('Http request timeout')));
            request.on('error', (err) => reject(err));
        });
    }

    private request(url: string, requestOptions: IRequestOptions, agent: SocksAgent) {
        const { protocol } = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(protocol)) {
            throw Error('Invalid request protocol!');
        }

        const sendOptions: SendOptions = {
            url,
            requestOptions,
            client: https,
        }

        if (protocol === 'http:') {
            sendOptions.client = http;
            return this.sendRequest(sendOptions, agent);
        }

        return this.sendRequest(sendOptions, agent);
    }

    get(url: string, agent: SocksAgent, options: TorRequestOptions = {}) {
        return this.request(
            url, 
            { 
                method: HttpMethod.GET,
                headers: options.headers || {}, 
            },
            agent);
    }

    post(url: string, data: object, agent: SocksAgent, options: TorRequestOptions = {}) {
        const dataString = formParser(data);
        return this.request(url, { 
            method: HttpMethod.POST, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
                ...options.headers,
            }
        }, agent);
    }
}