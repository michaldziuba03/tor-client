import { TorClient } from '../lib';

const onionUrls = {
    duckduckgo: 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/',
    ahmia: 'http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/',
}

describe('Test HTTP requests', () => {
    const client = new TorClient();

    it('should be configured to TOR', async () => {
        const res = await client.torcheck();

        expect(res).toEqual(true);
    });

    it('should make GET request to duckduckgo hidden services', async () => {
        const url = onionUrls.duckduckgo + '?q=linux';
        const res = await client.get(url);
        
        expect(res.status).toEqual(200);
        expect(res.data.includes('linux at DuckDuckGo')).toBeTruthy();
    });

    it('should make POST request to duckduckgo hidden services', async () => {
        const url = onionUrls.duckduckgo;
        const res = await client.post(url, { q: 'linux' });
        
        expect(res.status).toEqual(200);
        expect(res.data.includes('linux at DuckDuckGo')).toBeTruthy();
    });

    it('should make GET request to regular website', async () => {
        const url = 'https://en.wikipedia.org/wiki/Tor';
        const res = await client.get(url);

        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
    });

    it('should make GET request to ahmia hidden services', async () => {
        const url = onionUrls.ahmia;
        const res = await client.get(url);

        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
    })
});