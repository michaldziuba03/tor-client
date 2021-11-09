import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const isUsed = await client.torcheck();
        console.log(isUsed);
        const result = await client.get('http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/');
        console.log(result.data);
    } catch (err) {
        console.log(err);
    }
}

example();