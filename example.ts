import { TorClient } from './lib/tor';

async function example() {
    const client = new TorClient();

    try {
        const photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/German_-_Sabaton_for_the_Right_Foot_-_Walters_51591.jpg/800px-German_-_Sabaton_for_the_Right_Foot_-_Walters_51591.jpg';
        const result = await client.download(photoUrl, {
            dir: '/tmp',
            filename: 'sabaton.jpg',
        });
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

example();