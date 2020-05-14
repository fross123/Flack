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
        data.forEach(add_user);
        const add_user_button = document.querySelector('#add_user_button');
        add_user_button.disabled = true;
    });
});

// Add a new post with given contents to DOM.
const user_template = Handlebars.compile(document.querySelector('#user').innerHTML);
function add_user(contents) {
    // Create new post.
    const user = user_template({'contents': contents});

    // Add post to DOM.
    document.querySelector('#current_users').innerHTML += user;
}
