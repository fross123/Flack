if (!localStorage.getItem('display_name')) {
    localStorage.setItem('display_name', "");
}

document.addEventListener('DOMContentLoaded', () => {

    var display_name = localStorage.getItem('display_name');
    var channel_name = "";
    const add_user_button = document.querySelector('#add_user_button');
    const add_channel_button = document.querySelector("#add_channel_button");

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        if (display_name != "") {
            socket.emit('returning_user', {display_name: localStorage.getItem('display_name')});

            // enable create channel button
            add_channel_button.disabled = false;
        } else if (display_name == "") {
            add_user_button.disabled = false;
        }
    });

    socket.on('user_signed_in', data => {
        const current_users = data.display_name;

        // add current user to user list
        add_user(current_users);
    });

    socket.on('channel_created', data => {
        const channel_name = data.channel_name;

        // add channel to channel List
        add_channel(channel_name);
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

    /*document.querySelector('#messsage_form').onsubmit = () => {
        const message = document.querySelector('#message').value;

        socket.emit('new_message', {message: message});
    };*/
});

// Current channel button click
function messageView(current_channel_button) {
    // toggle messages display
    const x = document.getElementById("messages_view");
    if (x.style.display === "none") {
        x.style.display = "block";
        current_channel_button.classList.add("active");

    } else {
        x.style.display = "none";
        current_channel_button.classList.remove("active");

    }

    // add current channel to localStorage
    var current_channel = current_channel_button.innerHTML;
    localStorage.setItem('current_channel', current_channel);;
}

// Add a new channel to DOM.
const channel_template = Handlebars.compile(document.querySelector('#add_channel').innerHTML);
function add_channel(contents) {
    // Create new channel.
    const channel = channel_template({'contents': contents});

    // Add channel to DOM.
    document.querySelector('#channel_list').innerHTML += channel;
}

// Add a new user to DOM.
const user_template = Handlebars.compile(document.querySelector('#user').innerHTML);
function add_user(contents) {
    // Create new user.
    const user = user_template({'contents': contents});

    // Add user to DOM.
    document.querySelector('#current_users').innerHTML += user;
}
