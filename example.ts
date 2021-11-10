import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const path = await client.download('https://i1.jbzd.com.pl/contents/2021/11/normal/1PC6LnoPXmKGXbJE5nM2fNqFddaaxi2y.jpg');

        console.log(path);
    } catch (err) {
        console.log(err);
    }
}

example();