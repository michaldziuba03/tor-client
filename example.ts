import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();
    
    try {
        const result = await client.get('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=linux');
        console.log(result.data);
    } catch (err) {
        console.log(err);
    }
}

example();