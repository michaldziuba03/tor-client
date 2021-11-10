import { stdout } from 'process';
import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const isUsed = await client.torcheck();
        console.log(isUsed);
        const result = await client.get('https://www.deviceinfo.me/');

        stdout.write(result.data);
    } catch (err) {
        console.log(err);
    }
}

example();