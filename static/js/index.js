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
            // enable add user button
            add_user_button.disabled = false;

            // do not display channel list.
            document.querySelector("#channel_list").style.display = "none";
        }
    });

    socket.on('user_signed_in', data => {
        let current_users = data.display_name;

        // add current user to user list
        add_user(current_users);
    });

    socket.on('channel_created', data => {
        let channel_name = data.channel_name;

        // add channel to channel List
        add_channel(channel_name);
    });

    socket.on('loadMessages', data => {
        add_message(data);
    })

    socket.on('alert', data => {
        window.alert(data.alert);
    })

    document.querySelector('#form').onsubmit = () => {
        let name = document.querySelector('#name').value;
        display_name = name;

        localStorage.setItem('display_name', display_name);

        // clear input
        document.querySelector('#name').value = '';

        // diable add user button
        add_user_button.disabled = true;

        // enable create channel button
        add_channel_button.disabled = false;

        // Allow channels to be viewed.
        document.querySelector("#channel_list").style.display = "block";

        socket.emit('new_user', {display_name: display_name});

        return false;
    };

    document.querySelector('#new_channel_form').onsubmit = () => {
        let channel = document.querySelector('#channel_name').value;
        channel_name = channel;

        // clear input
        document.querySelector('#channel_name').value = '';

        socket.emit('new_channel', {channel_name: channel_name});

        return false;
    };

    document.querySelector('#messsage_form').onsubmit = () => {
        let message = document.querySelector('#message').value;

        // Clear input field
        document.querySelector('#message').value = '';

        socket.emit('send_message', {
            message: message,
            current_channel: localStorage.getItem('current_channel'),
            name: localStorage.getItem('display_name')
        });

        return false;
    };
});

function messageView(channelButton) {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // toggle messages display
    let x = document.querySelector("#messages_view");
    if (x.style.display === "none") {
        x.style.display = "block";

        // Make Current Channel Active
        channelButton.classList.add("active");

        let y = channelButton.innerHTML;
        let current_channel = y.replace(/(\r\n|\n|\r)/gm,"");

        // add current channel to localStorage
        localStorage.setItem('current_channel', current_channel);

        socket.emit('joinChannel', {
            current_channel: localStorage.getItem('current_channel'),
            display_name: localStorage.getItem('display_name')
        });
    } else {
        x.style.display = "none";

        // deactivate channel class
        channelButton.classList.remove("active");

        socket.emit('leaveChannel', {
            current_channel: localStorage.getItem('current_channel'),
            display_name: localStorage.getItem('display_name')
        });

        // remove current channel from localStorage
        localStorage.setItem('current_channel', "none");

        // clear innerHTML of messages List
        document.querySelector("#message_list").innerHTML = "";
    }
}

// Add a new message to DOM.
const messages_template = Handlebars.compile(document.querySelector('#messages').innerHTML);
function add_message(contents) {

    let displayStyle = "";

    if (contents.name == localStorage.getItem('display_name')) {
        displayStyle = "background: red";
    }
    else if (contents.name != localStorage.getItem('display_name')) {
        displayStyle = "background: blue";
    }

    // Create new message.
    let message = messages_template({
        'contents': contents.message + " from " + contents.name + " on " + contents.date, 'displayStyle': displayStyle});

    // Add message to DOM.
    document.querySelector('#message_list').innerHTML += message;
}

// Add a new channel to DOM.
const channel_template = Handlebars.compile(document.querySelector('#add_channel').innerHTML);
function add_channel(contents) {
    // Create new channel.
    let channel = channel_template({'contents': contents});

    // Add channel to DOM.
    document.querySelector('#channel_list').innerHTML += channel;
}

// Add a new user to DOM.
const user_template = Handlebars.compile(document.querySelector('#user').innerHTML);
function add_user(contents) {
    // Create new user.
    let user = user_template({'contents': contents});

    // Add user to DOM.
    document.querySelector('#current_users').innerHTML += user;
}
