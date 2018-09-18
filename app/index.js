"user strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const Room = require('./go/room.js');
const Message = require('./go/message.js');
// const Player = require("./go/player.js");

var availableRooms = [];
var playersByRoom = {};
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
    let roomName = "Room " + nRooms;
    let roomId = nRooms;
    let room = new Room(roomId, roomName);
    nRooms++;
    availableRooms.push(room);
    io.emit('new_room', room);
  });

  socket.on('subscribe', function(room) {
    socket.join(room);
    if (!playersByRoom[room]) playersByRoom[room] = 1;
    else playersByRoom[room]++;
    socket.username = "Player" + playersByRoom[room];
    io.to(socket.id).emit('username', socket.username);
  });
  socket.on('unsubscribe', function(room) {
    socket.leave(room);
  });
  socket.on('get_messages_history', function(room) {
    io.to(socket.id).emit('messages_history', messagesHistory[room]);
  });
  socket.on('new_message', function(msg, roomId) {
    if (!messagesHistory[roomId]) messagesHistory[roomId] = [];
    let newMessage = new Message(msg.sender, msg.body);
    messagesHistory[roomId].push(newMessage);
    io.to(roomId).emit('new_message', newMessage, roomId);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
