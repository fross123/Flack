document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('new_user', () => {

        document.querySelecor('#new-user').onsubmit = () => {

            socket.emit('new_user', {display_name: display_name})

            // Stop form from submitting
            return false;
        };
    });
});
