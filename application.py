import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_names = []
current_users = []
channels = []

@app.route("/")
def index():
    return render_template('index.html', display_names=display_names, current_users=current_users, channels=channels)

@socketio.on("new_user")
def new_user(data):
    display_name = data["display_name"]
    display_names.append(display_name)

    emit("user_signed_in", current_users, broadcast=True)

@socketio.on("returning_user")
def returning_user(data):
    display_name = data["display_name"]

    if display_name not in current_users:
        current_users.append(display_name)

    emit("user_signed_in", current_users, broadcast=True)

@socketio.on("new_channel")
def new_channel(data):
    channel_name = data["channel_name"]
    channels.append(channel_name)

    emit("channel_created", channels, broadcast=True)
