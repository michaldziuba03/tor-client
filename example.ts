import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();
    const result = await client.get('https://check.torproject.org/');
    console.log(result.data);
}

example();