if (!localStorage.getItem('display_name')) {
    localStorage.setItem('display_name', "");
}

document.addEventListener('DOMContentLoaded', () => {

    var display_name = localStorage.getItem('display_name');
    var channel_name = "";

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        if (display_name != "") {
            socket.emit('returning_user', {display_name: localStorage.getItem('display_name')});
        }
        else if (display_name == "") {
            const add_channel_button = document.querySelector("#add_channel_button");
            add_channel_button.disabled = true;
        }
    });

    socket.on('user_signed_in', data => {
        document.querySelector('#current_user').innerHTML = data;
    });

    document.querySelector('#form').onsubmit = () => {
        const name = document.querySelector('#name').value;
        display_name = name;

        localStorage.setItem('display_name', display_name);
        socket.emit('new_user', {display_name: display_name});
    };

    document.querySelector('#new_channel_form').onsubmit = () => {
        const channel = document.querySelector('#channel_name').value;
        channel_name = channel;

        socket.emit('new_channel', {channel_name: channel_name});
    };
});
