import { describe, test } from 'node:test';
import { rejects } from 'node:assert/strict';
import { TorClient } from '../lib';

describe('TOR client options test', () => {
    const client = new TorClient();

    test('should throw timeout error', () => {
        rejects(() => client.get('https://www.google.com', { timeout: 20 }));
    });
});
