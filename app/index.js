var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var availableRooms = [];
var messagesHistory = {};
var nRooms = 1;

app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

app.get('/room/:id', function(req, res) {
  if (req.params.id >= nRooms) {
    res.status(404).send('Not found');
  } else {
    res.sendFile(path.join(__dirname, '../templates/game.html'));
  }
});

io.on('connection', function(socket) {
  socket.on('get_available_rooms', function() {
    io.to(socket.id).emit('available_rooms', availableRooms);
  });
  socket.on('new_room', function() {
    var roomName = "Room " + nRooms;
    var roomId = nRooms;
    var room = {'id': roomId, 'name': roomName};
    nRooms++;
    availableRooms.push(room);
    io.emit('new_room', room);
  });

  socket.on('subscribe', function(room) {
    socket.join(room);
  });
  socket.on('unsubscribe', function(room) {
    socket.leave(room);
  });
  socket.on('get_messages_history', function(room) {
    io.to(socket.id).emit('messages_history', messagesHistory[room]);
  });
  socket.on('new_message', function(msg, roomId) {
    if (!messagesHistory[roomId]) messagesHistory[roomId] = [];
    messagesHistory[roomId].push(msg);
    io.to(roomId).emit('new_message', msg, roomId);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
