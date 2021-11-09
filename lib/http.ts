import http, { IncomingMessage, RequestOptions } from 'http';
import https from 'https';
import { ALLOWED_PROTOCOLS, HttpMethod, MimeTypes } from './constants';
import { formParser } from './parsers';
import { HttpResponse, SendOptions, SocksAgent, IRequestOptions } from './types';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
}

function buildResponse(res: IncomingMessage, data: string): HttpResponse {
    const status = res.statusCode || 200;
    const headers = res.headers;

    return { status, headers, data }
}

export class HttpClient {
    private sendRequest(options: SendOptions, agent: SocksAgent) {
        const { url, client, requestOptions } = options;
        return new Promise<HttpResponse>((resolve, reject) => {
            const options: RequestOptions = {
                method: requestOptions.method,
                headers: { ...requestOptions.headers, ...headers },
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

                res.on('end', () => console.log('End LOL'));

                res.on('close', () => {
                    const response = buildResponse(res, data);
                    resolve(response);
                });
            });

            if (requestOptions.data) {
                request.write(requestOptions.data);
            }

            request.end();

            request.on('timeout', () => reject(new Error('Request timeout')));
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

    get(url: string, agent: SocksAgent) {
        return this.request(url, { method: HttpMethod.GET }, agent);
    }

    post(url: string, data: object, agent: SocksAgent) {
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