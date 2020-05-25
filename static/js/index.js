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
        }

        /*
        document.querySelectorAll('#channel').forEach(button => {
            button.onclick = () => {
                // toggle messages display
                const x = document.querySelector("#messages_view");
                if (x.style.display === "none") {
                    x.style.display = "block";

                    // Make Current Channel Active
                    button.classList.add("active");

                    // add current channel to localStorage
                    localStorage.setItem('current_channel', button.innerHTML);

                } else {
                    x.style.display = "none";

                    button.classList.remove("active");

                    // remove current channel from localStorage
                    localStorage.setItem('current_channel', "none");
                }
            };
        });*/
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

    socket.on('message_sent', data => {
        //const message = data.message;
        //const channel = data.channel;
        //const date = data.date;

        add_message(data);

    })

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

    document.querySelector('#messsage_form').onsubmit = () => {
        const message = document.querySelector('#message').value;

        //current_date();

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

/*function current_date() {
    const d = new Date();
    const n = d.toLocaleString();
    document.querySelector("#message_date").innerHTML = n;
}*/

function messageView(channelButton) {
    // toggle messages display
    const x = document.querySelector("#messages_view");
    if (x.style.display === "none") {
        x.style.display = "block";

        // Make Current Channel Active
        channelButton.classList.add("active");

        const y = channelButton.innerHTML;
        const current_channel = y.replace(/(\r\n|\n|\r)/gm,"");

        // add current channel to localStorage
        localStorage.setItem('current_channel', current_channel);

    } else {
        x.style.display = "none";

        channelButton.classList.remove("active");

        // remove current channel from localStorage
        localStorage.setItem('current_channel', "none");
    }
}

// Add a new message to DOM.
const messages_template = Handlebars.compile(document.querySelector('#messages').innerHTML);
function add_message(contents) {

    //add Date
    //const d = new Date();
    //const n = d.toLocaleString();

    // Create new message.
    const message = messages_template({
        'contents':
            contents.message + " " +
            contents.name + " " +
            contents.current_channel
    });

    // Add message to DOM.
    document.querySelector('#message_list').innerHTML += message;
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
