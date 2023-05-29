import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

const server = http.createServer();
const ws = new WebSocketServer({ server });

const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients = {};

ws.on('connection', function (connection) {
  const userId = uuidv4();
  console.log(`${userId} connected. Total clients: ${Object.keys(clients).length}`);

  connection.on('message', (message) => {
    const data = JSON.parse(message);
    ws.clients.forEach((client) => {
      client.send(`[${data.time}] ${data.username}: ${data.message}`);
    })
  });
});
