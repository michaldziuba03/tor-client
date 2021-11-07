import http from 'http';
import https, { RequestOptions } from 'https';
import { SocksAgent } from './agent';
import { ALLOWED_PROTOCOLS, HttpMethod, MimeTypes } from './constants';
import { formParser } from './parsers';
import { SendOptions } from './types';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
}

export class HttpClient {
    private sendRequest(url: string, client: typeof http | typeof https, reqOptions: SendOptions) {
        return new Promise((resolve, reject) => {
            const options: RequestOptions = {
                method: reqOptions.method,
                headers: { ...reqOptions.headers, ...headers },
                agent: new SocksAgent({ host: 'localhost', port: 9050 }),
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
                    resolve(data);
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

    private request(url: string, reqOptions: SendOptions) {
        const { protocol } = new URL(url);
        if (!ALLOWED_PROTOCOLS.includes(protocol)) {
            throw Error('Invalid request protocol!');
        }

        if (protocol === 'http:') {
            return this.sendRequest(url, http, reqOptions);
        }

        return this.sendRequest(url, https, reqOptions);
    }

    get<T>(url: string) {
        return this.request(url, { method: HttpMethod.GET });
    }

    post<T>(url: string, data: object) {
        const dataString = formParser(data);
        return this.request(url, { 
            method: HttpMethod.POST, 
            data: dataString,
            headers: {
                'Content-Type': MimeTypes.FORM,
                'Content-Length': dataString.length,
            }
        });
    }
}