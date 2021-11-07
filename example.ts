import { HttpClient } from './lib/http';
import { Socks } from './lib/socks';

async function example() {
    const client = new HttpClient();
    const result = await client.get('http://www.google.com');
    console.log(result);
}

example();