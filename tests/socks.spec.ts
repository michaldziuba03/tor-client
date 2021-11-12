import { Socks } from '../lib';

describe('Test socks5 client', () => {
    const socks = new Socks({
        socksHost: '127.0.0.1',
        socksPort: 9050,
    });

    it('should connect to Tor socks5 server', async () => {
        const socket = await socks.connect('www.google.com', 443);
        socket.end();
        socket.destroy();
    })
})