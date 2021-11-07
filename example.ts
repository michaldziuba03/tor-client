import { HttpClient } from './lib/http';

async function example() {
    const client = new HttpClient();
    const result = await client.get('http://www.browser-info.net/');
    console.log(result);
}

example();