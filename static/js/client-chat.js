var createMessage = function(msg) {
  $('#messages').append($('<li>').text(msg));
}

$(function () {
  var socket = io();
  var roomId = window.location.href.split("/").pop();
  socket.emit('subscribe', roomId);
  socket.emit('get_messages_history', roomId);
  $('form').submit(function() {
    var msg = $('#m').val();
    if (msg) {
      socket.emit('new_message', msg, roomId);
      $('#m').val('');
    }
    return false;
  });
  socket.on('messages_history', function(messagesHistory) {
    if (messagesHistory) {
      messagesHistory.forEach(function(msg) {
        createMessage(msg);
      });
      var messagesContainer = $('#messages').get(0);
      messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    }
  });
  socket.on('new_message', function(msg, rId) {
    createMessage(msg);
    var messagesContainer = $('#messages').get(0);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
  });
});
