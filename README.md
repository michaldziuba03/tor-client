<p align="center">
  <img src="https://user-images.githubusercontent.com/43048524/140661072-83e416ee-8a33-46c0-b455-1155a0bc4588.png" width="180" alt="Nest Redis Logo" />
</p>

# Node.js Tor client
#### Node.js TOR client written in TypeScript; It is based on Node.js `http(s)` module and my implementation of SOCKS5 client.

### Features
- Simple codebase;
- Same `User-Agent` as in Tor Browser by default;
- Written in TypeScript;

### Installation
Install npm package
```bash
$ npm install @mich4l/tor-client
```

#### Install Tor
##### Arch/Manjaro/Garuda (Linux)
```bash
$ sudo pacman -S tor
$ sudo systemctl enable tor.service
$ sudo systemctl start tor.service
```
##### Debian/Ubuntu/Mint (Linux)
```bash
$ sudo apt install tor
```

### Code example
```ts
const client = new TorClient();
const result = await client.get('https://check.torproject.org/');
// status (number):
console.log(result.status);
// data (string by default):
console.log(result.data);
// headers (object):
console.log(result.headers);
```

### Documentation
#### Configuration for `SOCKS5` proxy
```ts
const client = new TorClient({ 
  socksHost: 'localhost' 
  socksPort: 2137,
});
```
By default client connects with `localhost:9050`.

#### `.torcheck(options?)`
Ping `https://check.torproject.org/` to check Tor connection status.
```ts
const client = new TorClient();
const isUsed = await client.torcheck();
console.log(isUsed); // true or false
```

#### `.get(url, options?)`
Make http GET request (works with regular and `.onion` sites).
```ts
const client = new TorClient();
const url = 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=tor';
const result = await client.get(url);
console.log(result.data); // HTML -> string
```

#### `.post(url, data, options?)`
Make http POST request (works with regular and `.onion` sites).
```ts
const client = new TorClient();
const url = 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/';
const result = await client.post(url, { q: 'tor' });
console.log(result.data); // HTML -> string
```

#### `.download(url, options?)`
Download response body to file (implementation based on Node.js Streams and works with binaries and text files)
```ts
const client = new TorClient();
const resultPath = await client.download('<any-url.png>', {
  path: './myfile.png',
});

console.log(resultPath); // string
```

#### Passing options for requests
You can pass you custom headers.
```ts
const client = new TorClient();
const result = await client.get('https://www.deviceinfo.me/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
  }
});

console.log(result.data);
```

By default TorClient uses User-Agent: `Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0` (from Tor Browser - most popular Tor client).