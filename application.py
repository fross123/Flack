import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_names = []

@app.route("/")
def index():
    return render_template('index.html', display_names=display_names)

@socketio.on("new_user")
def new_user(data):
    display_name = data["display_name"]
    display_names.append(display_name)
    #emit("new_user", display_names, broadcast=True)
