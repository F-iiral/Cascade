from private._server import TavernServer
from private.common.message_wrapper import MessageWrapper
from private.common.character import Character
from flask import render_template, request
from flask_sock import Server
import json
import copy

tavern = TavernServer.get()

@tavern.flask_app.route("/", methods=["GET"])
def index():
    return render_template("./main.html")

@tavern.flask_app.route("/api/conversation/messages", methods=["GET"])
def get_message():
    encoded = json.dumps([i.to_json() for i in tavern.llama_messages.values()])
    return encoded, 200
    
@tavern.flask_app.route("/api/conversation/messages", methods=["POST"])
def send_message():
    try:
        data = json.loads(request.data)
        data_content = data["content"]
        data_author = data["author"]

        new_message = MessageWrapper(role="user", content=data_content, author=data_author)
        tavern.llama_messages[new_message.id] = new_message
        tavern.run_model_stream()

        return json.dumps({"id": new_message.id}), 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/messages", methods=["DELETE"])
def delete_message():
    try:
        data = json.loads(request.data)
        data_id = data["id"]

        del tavern.llama_messages[data_id]

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/messages", methods=["PATCH"])
def edit_message():
    try:
        data = json.loads(request.data)
        data_content = data["content"]
        data_id = data["id"]

        if not (data_id in tavern.llama_messages.keys()):
            return "", 422
        
        old_message = tavern.llama_messages[data_id]
        old_message.message.content = data_content

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/retry", methods=["POST"])
def retry_conversation():
    data = json.loads(request.data)
    data_id = data["id"]

    messages = copy.copy(tavern.llama_messages)
    for message_id in messages:
        if message_id >= data_id:
            del tavern.llama_messages[message_id]
    
    tavern.run_model_stream()

    return "", 200

@tavern.flask_app.route("/api/conversation/switch", methods=["POST"])
def switch_conversation():
    tavern.llama_messages = {}
    return "", 200

@tavern.flask_app.route("/api/conversation/clear", methods=["DELETE"])
def clear_conversation():
    tavern.llama_messages = {}
    return "", 200

@tavern.flask_sock.route("/ws")
def websocket_route(ws: Server):
    tavern.ws = ws

    while tavern.running:
        user_input = tavern.ws.receive()
        if user_input:
            print(f"Message from client: {user_input}")

        new_message = MessageWrapper(role="user", content=user_input, author="Assistant")
        tavern.llama_messages[new_message.id] = new_message
        tavern.run_model_stream()