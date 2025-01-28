from private._server import TavernServer
from private.common.message_wrapper import MessageWrapper
from private.common.character import Character
from private.common.conversation import Conversation
from private.database import Database
from flask import render_template, request
from flask_sock import Server
from simple_websocket import ConnectionClosed
import json
import copy

tavern = TavernServer.get()
database = Database.get()

@tavern.flask_app.route("/", methods=["GET"])
def index():
    return render_template("./main.html")

@tavern.flask_app.route("/api/conversation/messages", methods=["GET"])
def get_message():
    encoded = json.dumps([i.to_json() for i in tavern.conversation.messages.values()])
    return encoded, 200
    
@tavern.flask_app.route("/api/conversation/messages", methods=["POST"])
def send_message():
    try:
        data = json.loads(request.data)
        data_content = data["content"]
        data_author = data["author"]

        new_message = MessageWrapper(role="user", content=data_content, author=data_author)
        tavern.conversation.messages[new_message._id] = new_message
        tavern.run_model_stream()

        return json.dumps({"id": new_message._id}), 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/messages", methods=["DELETE"])
def delete_message():
    try:
        data = json.loads(request.data)
        data_id = data["id"]

        del tavern.conversation.messages[data_id]

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

        if not (data_id in tavern.conversation.messages.keys()):
            return "", 422
        
        old_message = tavern.conversation.messages[data_id]
        old_message.message.content = data_content

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/retry", methods=["POST"])
def retry_conversation():
    try:
        data = json.loads(request.data)
        data_id = data["id"]

        messages = copy.copy(tavern.conversation.messages)
        for message_id in messages:
            if message_id >= data_id:
                del tavern.conversation.messages[message_id]
        
        tavern.run_model_stream()

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/conversation/clear", methods=["DELETE"])
def clear_conversation():
    tavern.conversation.messages = {}
    return "", 200

@tavern.flask_app.route("/api/account/conversation", methods=["GET"])
def get_all_conversation():
    conversations = database.get_all_conversations()
    if conversations == None or conversations == []:
        return "", 204

    encoded = json.dumps([i.to_json() for i in conversations])
    return encoded, 200

@tavern.flask_app.route("/api/account/conversation", methods=["DELETE"])
def delete_conversation():
    try:
        data = json.loads(request.data)
        data_id = data["id"]
        database.delete_conversation(data_id)

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/account/conversation", methods=["PATCH"])
def rename_conversation():
    try:
        data = json.loads(request.data)
        data_id = data["id"]
        data_name = data["name"]

        conversation = database.get_conversation(data_id)
        if conversation:
            conversation.name = data_name
            database.save_conversation(conversation)
            return "", 200
        else:
            return "", 422
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/account/conversation/create", methods=["POST"])
def create_new_conversation():
    try:
        data = json.loads(request.data)
        data_character_ids = data["characters"]

        # TODO: Properly add this
        if data_character_ids != None:
            loaded_characters = []
            for character_id in data_character_ids:
                new_character = database.get_character(character_id)
                if new_character != None:
                    loaded_characters.append(new_character)
        else:
            loaded_characters = [tavern.llama_current_character]

        if tavern.conversation.messages != {}:
            database.save_conversation(tavern.conversation)

        new_conversation = Conversation(characters=loaded_characters, messages={}, name="New Conversation")
        tavern.conversation = new_conversation
        tavern.llama_current_character = loaded_characters[0]

        return json.dumps(new_conversation.to_json()), 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/account/conversation/switch", methods=["POST"])
def switch_to_conversation():
    try:
        data = json.loads(request.data)
        data_id = data["id"]

        if tavern.conversation.messages != {}:
            database.save_conversation(tavern.conversation)
        
        new_conversation = database.get_conversation(data_id)
        tavern.conversation = new_conversation

        return "", 200
    except KeyError:
        return "", 400
    except:
        return "", 500

@tavern.flask_app.route("/api/account/character", methods=["GET"])
def get_all_characters():
    characters = database.get_all_characters()
    if characters == None or characters == []:
        return "", 204

    encoded = json.dumps([i.to_json() for i in characters])
    return encoded, 200

@tavern.flask_sock.route("/ws")
def websocket_route(ws: Server):
    tavern.ws = ws

    while tavern.running:
        try:
            user_input = tavern.ws.receive()
            if user_input:
                print(f"Message from client: {user_input}")

            new_message = MessageWrapper(role="user", content=user_input, author="Assistant")
            tavern.conversation.messages[new_message._id] = new_message
            tavern.run_model_stream()
        except ConnectionClosed:
            tavern.ws = None
            ws.close(1006)
            del ws  # memory leak :3