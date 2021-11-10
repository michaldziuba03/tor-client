import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {

    } catch (err) {
        console.log(err);
    }
}

example();