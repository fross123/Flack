import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

display_name = []

@app.route("/")
def index():
	return render_template("index.html", display_name=display_name)

@socketio.on("register display_name")
def name(data):
    display_name = data["display_name"]
