import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const result = await client.torcheck();
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

example();