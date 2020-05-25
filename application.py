import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = '247e489ce72804f050ad8ac1b25cebfa'
socketio = SocketIO(app)

display_names = []
current_users = []
channel_list = []
messages = []

@app.route("/")
def index():
    return render_template('index.html', display_names=display_names, current_users=current_users, channel_list=channel_list, messages=messages)

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

@socketio.on("send_message")
def new_message(data):
    message = data["message"]
    channel = data["current_channel"]

    message_info = {
        "message": message,
        #"date": data["date"],
        "channel": channel
    }

    messages.append(message_info)

    emit("message_sent", {"message": message, "current_channel": channel}, broadcast=True)
