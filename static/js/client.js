function load() {
    $('body').addClass('loading');
}

function loaded() {
    $('body').removeClass('loading');
}

var socket = io();
window.onbeforeunload = function () {
    socket.emit('leave');
    load();
};
