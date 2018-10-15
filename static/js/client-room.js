var createMessage = function(msg) {
  $('#messages').append($('<li>').html("<span class='text-small'>[" + msg._formattedTime + "] " + msg._sender + "</span>" + msg._body));
}

$(function () {
  var roomId = window.location.href.split("/").pop();

  socket.on('username', function(username) {
    socket.username = username;
  })
  socket.on('messages_history', function(messagesHistory) {
    if (messagesHistory) {
      messagesHistory.forEach(function(msg) {
        createMessage(msg);
      });
      var messagesContainer = $('#messages').get(0);
      messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    }
    loaded();
  });
  socket.on('new_message', function(msg, rId) {
    createMessage(msg);
    var messagesContainer = $('#messages').get(0);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
  });

  socket.emit('subscribe', roomId);
  socket.emit('get_messages_history', roomId);

  $('#m').focus();
  $('form').submit(function() {
    var body = $('#m').val();
    if (body) {
      msg = {
        'sender': socket.username,
        'body': body
      }
      socket.emit('new_message', msg, roomId);
      $('#m').val('');
    }
    return false;
  });
});
