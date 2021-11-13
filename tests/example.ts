import { Socks, TorClient } from '../lib';

async function test() {
    const client = new TorClient();

    try {
        const result = await client.get('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=tor');
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

test();