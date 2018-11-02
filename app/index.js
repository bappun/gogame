"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const Room = require('./go/room.js');
const Message = require('./go/message.js');
// const Player = require("./go/player.js");

var availableRooms = [];
var messagesHistory = {};
var nRooms = 1;

app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../templates/index.html'));
});

app.get('/room/:id', function (req, res) {
    if (req.params.id >= nRooms) {
        res.status(404).send('Not found');
    } else {
        res.sendFile(path.join(__dirname, '../templates/room.html'));
    }
});

io.on('connection', function (socket) {
    socket.on('get_available_rooms', function () {
        io.to(socket.id).emit('available_rooms', availableRooms);
    });
    socket.on('new_room', function () {
        let roomName = "Room " + nRooms;
        let roomId = nRooms;
        let room = new Room(roomId, roomName);
        nRooms++;
        availableRooms.push(room);
        io.emit('new_room', room);
    });

    socket.on('subscribe', function (room) {
        socket.join(room);
        let roomLength = io.sockets.adapter.rooms[room].length;
        let gameRoom = 'game' + room;
        let gameRoomLength = io.sockets.adapter.rooms[gameRoom] ? io.sockets.adapter.rooms[gameRoom].length : 0;
        if (gameRoomLength < 2) {
            if (gameRoomLength === 1) {
                if (io.sockets.connected[Object.keys(io.sockets.adapter.rooms[gameRoom].sockets)[0]].username === "Player2") {
                    socket.username = "Player1";
                    socket.color = "white";
                } else {
                    socket.username = "Player2";
                    socket.color = "black";
                }
            } else {
                let playerNb = (gameRoomLength + 1);
                socket.username = "Player" + playerNb;
                playerNb === 1 ? socket.color = "white" : socket.color = "black";
            }
            socket.join(gameRoom);
        } else {
            socket.username = "Spec" + (roomLength - 2);
            socket.color = null;
        }

        io.to(socket.id).emit('username color', socket.username, socket.color);
    });
    socket.on('unsubscribe', function (room) {
        socket.leave(room);
    });
    socket.on('leave', function () {
        socket.disconnect();
    });
    socket.on('get_messages_history', function (room) {
        io.to(socket.id).emit('messages_history', messagesHistory[room]);
    });
    socket.on('new_message', function (msg, roomId) {
        if (!messagesHistory[roomId]) messagesHistory[roomId] = [];
        let newMessage = new Message(msg.sender, msg.body);
        messagesHistory[roomId].push(newMessage);
        io.to(roomId).emit('new_message', newMessage, roomId);
    });

    socket.on('move', function (roomId, color, x, y) {
        io.to(roomId).emit('new_move', color, x, y);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
