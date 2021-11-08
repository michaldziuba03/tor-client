import http, { IncomingMessage } from 'http';
import https, { RequestOptions } from 'https';
import { ALLOWED_PROTOCOLS, HttpMethod, MimeTypes } from './constants';
import { formParser } from './parsers';
import { HttpResponse, SendOptions } from './types';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
}


function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}

export class HttpClient {
    private sendRequest(url: string, client: typeof http | typeof https, reqOptions: SendOptions, agent: any) {
        return new Promise<HttpResponse>((resolve, reject) => {
            const options: RequestOptions = {
                method: reqOptions.method,
                headers: { ...reqOptions.headers, ...headers },
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

            if (reqOptions.data) {
                request.write(reqOptions.data);
            }

            request.end();

            request.on('timeout', () => reject(new Error('Request timeout')));
            request.on('error', (err) => reject(err));
        });
    }

    private request(url: string, reqOptions: SendOptions, agent: any) {
        const { protocol } = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(protocol)) {
            throw Error('Invalid request protocol!');
        }

        if (protocol === 'http:') {
            return this.sendRequest(url, http, reqOptions, agent);
        }

        return this.sendRequest(url, https, reqOptions, agent);
    }

    get<T>(url: string, agent: any) {
        return this.request(url, { method: HttpMethod.GET }, agent);
    }

    post<T>(url: string, data: object, agent: any) {
        const dataString = formParser(data);
        return this.request(url, { 
            method: HttpMethod.POST, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
            }
        }, agent);
    }
}