import { describe, test } from 'node:test';
import { equal, ok } from 'node:assert/strict';
import { TorClient } from '../lib';

const onionUrls = {
    duckduckgo: 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/',
    ahmia: 'http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/',
}

describe('Test HTTP requests', () => {
    const client = new TorClient();

    test('should be configured to TOR', async () => {
        const res = await client.torcheck();
        ok(res);
    });

    test('should make GET request to duckduckgo hidden services', async () => {
        const url = onionUrls.duckduckgo + '?q=linux';
        const res = await client.get(url);
        
        equal(res.status, 200);
        ok(res.data.includes('linux at DuckDuckGo'));
    });

    test('should make POST request to duckduckgo hidden services', async () => {
        const url = onionUrls.duckduckgo;
        const res = await client.post(url, { q: 'linux' });
        
        equal(res.status, 200);
        ok(res.data.includes('linux at DuckDuckGo'));
    });

    test('should make GET request to regular website', async () => {
        const url = 'https://en.wikipedia.org/wiki/Tor';
        const res = await client.get(url);

        equal(res.status, 200);
    });

    test('should make GET request to ahmia hidden services', async () => {
        const url = onionUrls.ahmia;
        const res = await client.get(url);

        equal(res.status, 200);
    })
});