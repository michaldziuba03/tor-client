const { TorClient } = require('../dist');

async function test() {
    try {
        const client = new TorClient();
        const result = await client.get('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=tor');
        console.log(result);
    } catch (err) {
        console.log(err.message);
    }
}

test();
