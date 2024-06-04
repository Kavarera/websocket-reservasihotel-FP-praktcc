const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Event ketika koneksi WebSocket terbuka
wss.on('connection', function connection(ws) {
  console.log('Client terhubung');

  // Event ketika menerima pesan dari klien
  ws.on('message', function incoming(message) {
    try {
      // Parsing pesan sebagai JSON
      const parsedMessage = JSON.parse(message);
      console.log(`${parsedMessage["pengirim"]}: ${parsedMessage["pesan"]}`);

      // Mengirim pesan balasan ke semua klien yang terhubung
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${parsedMessage["pengirim"]}: ${parsedMessage["pesan"]}`);
        }
      });
    } catch (e) {
      console.error('Pesan yang diterima bukan JSON yang valid:', message);
    }
  });

  // Event ketika koneksi WebSocket ditutup
  ws.on('close', function close() {
    console.log('Client terputus');
  });
});

server.listen(3000, function listening() {
  console.log('Server berjalan di port 3000');
});
