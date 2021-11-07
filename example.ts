import { HttpClient } from './lib/http';

async function example() {
    const client = new HttpClient();

    const result = await client.post('http://localhost:8080', {
        id: 2137,
        username: 'Carl',
    });
    console.log(result);
}

example();