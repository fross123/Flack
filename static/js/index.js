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
        // Add user to dom
        data.forEach(add_user);

        // disable submit new user button
        const add_user_button = document.querySelector('#add_user_button');
        add_user_button.disabled = true;

        // enable create channel button
        const add_channel_button = document.querySelector("#add_channel_button");
        add_channel_button.disabled = false;
    });

    socket.on('channel_created', data => {
        // add channel to channel List
        data.forEach(add_channel);
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

// Add a new channel to DOM.
const channel_template = Handlebars.compile(document.querySelector('#add_channel').innerHTML);
function add_channel(contents) {
    // Create new channel.
    const channel = channel_template({'contents': contents});

    // Add channel to DOM.
    document.querySelector('#channel_list').innerHTML += channel;
};

// Add a new user to DOM.
const user_template = Handlebars.compile(document.querySelector('#user').innerHTML);
function add_user(contents) {
    // Create new user.
    const user = user_template({'contents': contents});

    // Add user to DOM.
    document.querySelector('#current_users').innerHTML += user;
};
