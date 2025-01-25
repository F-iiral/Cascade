from private._server import TavernServer
from private.message_wrapper import MessageWrapper
from flask import render_template, request
from flask_sock import Server
import json

tavern = TavernServer.get()

@tavern.flask_app.route("/", methods=["GET"])
def index():
    return render_template("./main.html")

@tavern.flask_app.route("/api/message", methods=["GET"])
def get_message():
    encoded = json.dumps([i.to_json() for i in tavern.llama_messages.values()])
    return encoded, 200
    
@tavern.flask_app.route("/api/message", methods=["POST"])
def send_message():
    try:
        data = json.loads(request.data)
        data_content = data["content"]
        data_author = data["author"]

        new_message = MessageWrapper(role="user", content=data_content, author=data_author)
        tavern.llama_messages[new_message.timestamp] = new_message
        tavern.run_model_stream()

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/message", methods=["DELETE"])
def delete_message():
    try:
        data = json.loads(request.data)
        data_timestamp = data["timestamp"]

        del tavern.llama_messages[data_timestamp]

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/message", methods=["PATCH"])
def edit_message():
    try:
        data = json.loads(request.data)
        data_content = data["content"]
        data_timestamp = data["timestamp"]
        data_author = data["author"]

        edited_message = MessageWrapper(role="user", content=data_content, timestamp=data_timestamp, author=data_author)
        tavern.llama_messages[data_timestamp] = edited_message

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_sock.route("/ws")
def websocket_route(ws: Server):
    tavern.ws = ws

    while tavern.running:
        user_input = tavern.ws.receive()
        if user_input:
            print(f"Message from client: {user_input}")

        new_message = MessageWrapper(role="user", content=user_input, author="Assistant")
        tavern.llama_messages[new_message.timestamp] = new_message
        tavern.run_model_stream()