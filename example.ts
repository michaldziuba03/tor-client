import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const url = 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/';
        const result = await client.post(url, { q: 'tor' });
        console.log(result.data);
    } catch (err) {
        console.log(err);
    }
}

example();