var net = require('net');

var players = [];

function broadcast(message, sender) {
  players.forEach(function (client) {
    if (client === sender) return;
    client.write(message);
  });
  process.stdout.write(message)
}

var server = net.createServer(function(socket) {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  socket.game = {};
  players.push(socket);

  socket.write("Welcome " + socket.name + "\n");
  broadcast(socket.name + " joined the chat\n", socket);

  socket.on('data', function (data) {
    const position = JSON.parse(data);
    socket.game.position = position;
    const broadcastPosition = { [socket.name]: position };
    broadcast(JSON.stringify(broadcastPosition) + '\n', socket);
  });

  socket.on('end', function () {
    players.splice(players.indexOf(socket), 1);
    broadcast(socket.name + " left the chat.\n");
  });
});

server.listen(3001, '127.0.0.1');
console.log("Chat server running at port 3001\n");
