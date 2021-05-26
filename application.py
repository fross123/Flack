import time

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = '247e489ce72804f050ad8ac1b25cebfa'
socketio = SocketIO(app)

display_names = []
current_users = []
channel_list = []
messages = []

@app.route("/")
def index():
    return render_template('index.html', display_names=display_names, current_users=current_users, channel_list=channel_list)

@socketio.on("new_user")
def new_user(data):
    display_name = data["display_name"]

    if display_name not in display_names:
        display_names.append(display_name)
        current_users.append(display_name)

        emit("user_signed_in", {"display_name": display_name}, broadcast=True)

@socketio.on("returning_user")
def returning_user(data):
    display_name = data["display_name"]

    if display_name not in current_users:
        current_users.append(display_name)
        emit("user_signed_in", {"display_name": display_name}, broadcast=True)

@socketio.on("new_channel")
def new_channel(data):
    channel_name = data["channel_name"]

    if channel_name not in channel_list:
        channel_list.append(channel_name)

        emit("channel_created", {"channel_name": channel_name}, broadcast=True)
        
@socketio.on('join')
def on_join(data):
    display_name = data['display_name']
    current_channel = data['current_channel']
    emit("alert", {"alert": "Test this."})

    for message_info in messages:
        if message_info["channel"] == current_channel:
            emit("loadMessages", {"message": message_info['message'], "channel": message_info['channel'], "name": message_info['display_name'], "date": message_info['date']})
    
    join_room(current_channel)


@socketio.on('leave')
def on_leave(data):
    display_name = data['display_name']
    current_channel = data['current_channel']
    leave_room(current_channel)

@socketio.on("deleteMessages")
def delete_Messages(data):
    name = data['display_name']

    # delete messages from server by sender
    messages[:] = [i for i in messages if not (i['display_name'] == name)]

@socketio.on("send_message")
def new_message(data):
    message = data["message"]
    channel = data["current_channel"]
    display_name = data["name"]
    date = datetime.datetime.now()
    dateString = date.strftime("%a, %b %d %Y at %I:%M %p")


    message_info = {
        "message": message,
        "date": dateString,
        "channel": channel,
        "display_name": display_name
    }

    # If more than 100 messages are saved, then emit alert.
    countMessages = (sum(x.get('channel') == channel for x in messages))
    if countMessages > 99:
        emit("alert", {"alert": "You have reached your maximum number of messages on this channel, please delete some in order to send another message"})

    # If message count is less than or equal to 100 add to list and emit to client.
    elif countMessages <= 99:
        messages.append(message_info)
        emit("loadMessages", {"message": message, "channel": channel, "name": display_name, "date": dateString}, to=channel)

if __name__ == '__main__':
    socketio.run(app)
    # app.run(debug=True, host='0.0.0.0')
