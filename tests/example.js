const { TorClient, Socks } = require('../dist');

//const URL = 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=tor';
const URL = 'https://duckduckgo.com';

async function test() {
    try {
        const client = new TorClient();
        const result = await client.get(URL, { timeout: 10 * 1000 });

        /* Testing with netcat: 
        const socksClient = await Socks.connect({ socksHost: 'localhost', socksPort: 9050 });
        //socksClient.socket.destroy();
        const result = await socksClient.request('localhost', 80);
        */

        console.log(`Result:`, result);
    } catch (err) {
        console.log("We got error!");
        console.log(err.message);
    }
}

test();
