if (!localStorage.getItem('display_name')) {
    localStorage.setItem('display_name', "");
    localStorage.setItem('display_name_created', false);
}

document.addEventListener('DOMContentLoaded', () => {

    var display_name = localStorage.getItem('display_name');
    var display_name_created = localStorage.getItem('display_name_created');

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        if (display_name_created != false) {
            socket.emit('returning_user', {display_name: display_name});
        }

        document.querySelector('#form').onsubmit = () => {
            const name = document.querySelector('#name').value;
            display_name = name;
            display_name_created = true;

            localStorage.setItem('display_name', display_name);
            localStorage.setItem('display_name_created', display_name_created);
            socket.emit('new_user', {display_name: display_name});
        };
    });
});
