import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const result = await client.get('https://raw.githubusercontent.com/mich4ld/ublock-filter/main/filter.txt');

        console.log(result.status);
    } catch (err) {
        console.log(err);
    }
}

example();