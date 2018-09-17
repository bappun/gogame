var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(__dirname, '../templates/game.html'));

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });
});

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
