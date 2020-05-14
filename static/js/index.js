if (!localStorage.getItem('display_name')) {
    localStorage.setItem('display_name', "");
    localStorage.setItem('display_name_created', false);
}

document.addEventListener('DOMContentLoaded', () => {



    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#form').onsubmit = () => {
            const name = document.querySelector('#name').value;
            display_name = name;
            display_name_created = true;

            localStorage.setItem('display_name', display_name);
            localStorage.setItem('display_name_created', display_name_created);
            socket.emit('new_user', {display_name: display_name});
        };
    });

    socket.on('emit_names', data => {
        document.querySelector('#display_names').innerHTML = data.display_names;
    });
});
