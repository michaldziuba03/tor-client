import { TorClient } from '../lib';

describe('TOR client options test', () => {
    const client = new TorClient();

    it ('should throw timeout error', async () => {
        expect(() => client.get('https://www.google.com', { timeout: 20 })).rejects.toThrow();
    });
});