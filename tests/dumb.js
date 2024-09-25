const net = require('net');

/**
 * Handle initial SOCKS5 handshake.
 *
 * @param {net.Socket} socket
 * @param {Buffer} chunk
 */
function handleInitialize(socket, chunk) {
  console.log('<HANDSHAKE>');
  if (chunk.length < 2)
    return;

  console.log('Received:', chunk);
  const response = Buffer.from([0x5, 0x0]);
  socket.write(response);

  socket.removeAllListeners('data');
  socket.on('data', (data) => handleConnectionRequest(socket, data));
}

/**
 * Handle connnection request
 *
 * @param {net.Socket} socket
 * @param {Buffer} chunk
 */
function handleConnectionRequest(socket, chunk) {
  console.log('<CONNECTION>');
  console.log('Received:', chunk);
  
  const response = Buffer.from([0x5, 0x0, 0x0, 0x01, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);
  const httpResponse = 'HTTP/1.1 200 OK\r\nContent-Length: 13\r\n\r\nHello, World!';
  socket.write(Buffer.concat([response, Buffer.from(httpResponse)]));
  //socket.write(response);

  socket.removeAllListeners('data');
  socket.on('data', (data) => dumbTunnel(socket, data));
  console.log('<TUNNEL>');
}

/**
 * Echo request as response
 *
 * @param {net.Socket} socket
 * @param {Buffer} chunk
 */
function dumbTunnel(socket, chunk) {
  console.log('Received:', chunk);
  socket.write(chunk);
}

const server = net.createServer((socket) => {
  // assume that all data comes at once
  console.log('<CONNECTION>');
  socket.on('data', chunk => handleInitialize(socket, chunk));
  socket.on('close', () => {
    socket.destroy();
  })
  socket.on('error', (err) => {
    console.log('<ERROR>');
    console.error(err.message);
  })
});

server.listen(9050, () => {
  console.log("Dummy SOCKS5 server started.");
});
