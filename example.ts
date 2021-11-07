import { HttpClient } from './lib/http';

async function example() {
    const client = new HttpClient();
    const result = await client.get('http://check.torproject.org/');
    console.log(result);
}

example();