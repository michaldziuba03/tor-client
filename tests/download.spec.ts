import { describe, test } from 'node:test';
import { equal } from 'node:assert/strict';
import { TorClient } from '../lib';

describe('Test Tor download', () => {
    const client = new TorClient();

    test('should download image to ./downloads folder', async () => {
        const logoUrl = 'http://2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion/static/images/tor-logo@2x.png?h=16ad42bc';
        const res = await client.download(logoUrl, {
            dir: './downloads'
        });

        equal(typeof res, 'string');
    });
})
