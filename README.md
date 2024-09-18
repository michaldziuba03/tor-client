<div align="center">
  <img alt="logo" src="https://github.com/user-attachments/assets/0825ceb7-837a-4aa4-a34e-4e29b6cf66d4">
</div>

<h1 align="center">
  Node.js Tor client
</h1>

<p align="center">
  A simple library for making HTTP requests over the Tor network programmatically in JavaScript.
</p>

## 🧅 Features

- [x] Simple codebase
- [x] Own implementation of SOCKS5 protocol
- [x] Built-in HTTP wrapper (but still possible to use with `axios`) 
- [x] Same `User-Agent` as in Tor Browser by default
- [x] Written in TypeScript
- [x] No external dependencies 

### Install Tor

This library expects Tor proxy server to be available locally on port `9050` (by default).

#### Arch/Manjaro/Garuda (Linux)
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

#### Request options
By default request does **not** have any timeout.
```ts
{
  headers: object,
  timeout: number,
}
```

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
  filename: 'myfile.png',
  dir: './downloads' // folder must exists!
});

console.log(resultPath); // string
```

#### Passing options for requests
You can pass your custom headers and request timeout.
```ts
const client = new TorClient();
const result = await client.get('https://www.deviceinfo.me/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
  },
  timeout: 20000,
});

console.log(result.data);
```

By default TorClient uses User-Agent: `Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0` (from Tor Browser - most popular Tor client).

## License

Distributed under the MIT License. See `LICENSE` for more information.
