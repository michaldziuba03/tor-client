import { stdout } from 'process';
import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const result = await client.get('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=tor');

        stdout.write(result.data);
    } catch (err) {
        console.log(err);
    }
}

example();