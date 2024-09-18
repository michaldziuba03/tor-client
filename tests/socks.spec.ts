import { Socks } from '../lib';

describe('Test socks5 client', () => {
    it('should connect to Tor socks5 server', async () => {
        const socks = await Socks.connect({
            socksHost: '127.0.0.1',
            socksPort: 9050,
        });

        const socket = await socks.proxy('www.google.com', 443);
        expect(socket).toBeDefined();
        socket.end();
        socket.destroy();
    })
})