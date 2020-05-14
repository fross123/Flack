if (!localStorage.getItem('display_name')) {
    localStorage.setItem('display_name', "");
}

document.addEventListener('DOMContentLoaded', () => {

    var display_name = localStorage.getItem('display_name');

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        if (display_name != "") {
            socket.emit('returning_user', {display_name: localStorage.getItem('display_name')});
        }

        document.querySelector('#form').onsubmit = () => {
            const name = document.querySelector('#name').value;
            display_name = name;

            localStorage.setItem('display_name', display_name);
            socket.emit('new_user', {display_name: display_name});
        };
    });

    socket.on('user_signed_in', data => {
        document.querySelector('#current_user').innerHTML = data;
    });
});
