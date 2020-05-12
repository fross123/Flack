import os

from flask import Flask, render_template, jsonify, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
	# Check if user has been made
	if 'user' in session:
		return render_template("channels.html")
	return render_template("index.html")

@app.route("/channels")
def channels():
	return render_template("channels.html")


@app.route("/display_name", methods=["POST"])
def display_name():

	session['user'] = request.form.get("display_name")

	return jsonify({"success": True, "name": session['user']})

@app.route("/posts", methods=["POST"])
def posts():

    # Get start and end point for posts to generate.
    start = int(request.form.get("start") or 0)
    end = int(request.form.get("end") or (start + 9))

    # Generate list of posts.
    data = []
    for i in range(start, end + 1):
        data.append(f"Post #{i}")

    # Return list of posts.
    return jsonify(data)
