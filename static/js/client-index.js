var createRoom = function(room) {
  $('#room-add').before('<li><a href="/room/' + room._id + '">' + room._name + '</a></li>');
}
$(function () {
  var socket = io();

  socket.on('available_rooms', function(availableRooms) {
    availableRooms.forEach(function(room) {
      createRoom(room);
    });
    loaded();
  });
  socket.on('new_room', function(newRoom) {
    createRoom(newRoom);
  });

  $('#room-add').on('click', function() {
    socket.emit('new_room');
    return false;
  });
  socket.emit('get_available_rooms');
});
