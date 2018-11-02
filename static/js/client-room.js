function createMessage(msg) {
    $('#messages').append($('<li>').html("<span class='text-small'>[" + msg._formattedTime + "] " + msg._sender + "</span>" + msg._body));
}

$(function () {
    let roomId = window.location.href.split("/").pop();

    socket.on('username color', function (username, color) {
        socket.username = username;
        socket.color = color;

        $('#m').focus();
        $('form').submit(function () {
            let body = $('#m').val();
            if (body) {
                msg = {
                    'sender': socket.username,
                    'body': body
                };
                socket.emit('new_message', msg, roomId);
                $('#m').val('');
            }
            return false;
        });

        // game grid
        $('#game').addClass(socket.color);
        for (x = 0; x < 13; x++) {
            $('#game').append('<div id="row-' + x + '" class="row"></div>');
            for (y = 0; y < 13; y++) {
                $('#row-' + x).append('<div class="cell" data-x="' + x + '" data-y="' + y + '"></div>');
            }
        }
        if (socket.color) {
            $('.cell').on('click', function () {
                socket.emit('move', roomId, socket.color, $(this).data('x'), $(this).data('y'));
            });
        }
    });
    socket.on('messages_history', function (messagesHistory) {
        if (messagesHistory) {
            messagesHistory.forEach(function (msg) {
                createMessage(msg);
            });
            let messagesContainer = $('#messages').get(0);
            messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
        }
        loaded();
    });
    socket.on('new_message', function (msg, rId) {
        createMessage(msg);
        let messagesContainer = $('#messages').get(0);
        messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    });
    socket.on('new_move', function (color, x, y) {
        $('.cell[data-x="' + x + '"][data-y="' + y + '"]').addClass(color);
    });

    socket.emit('subscribe', roomId);
    socket.emit('get_messages_history', roomId);
});
