import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_names = []
current_user = []

@app.route("/")
def index():
    return render_template('index.html', display_names=display_names, current_user=current_user)

@socketio.on("new_user")
def new_user(data):
    display_name = data["display_name"]
    display_names.append(display_name)
    current_user.clear()
    current_user.append(display_name)

@socketio.on("returning_user")
def returning_user(data):
    display_name = data["display_name"]
    current_user.clear()
    current_user.append(display_name)
