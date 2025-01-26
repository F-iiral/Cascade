from __future__ import annotations
from private.common.message_wrapper import MessageWrapper
from private.common.character import Character
from private.database import Database
from private.common.conversation import Conversation
from flask import Flask
from flask_sock import Sock, Server
from ollama import Client, Message
import json
import asyncio
import threading

class TavernServer:
    inst: TavernServer = None

    @staticmethod
    def get() -> TavernServer:
        if TavernServer.inst != None:
            return TavernServer.inst
        
        inst = TavernServer()
        TavernServer.inst = inst
        return inst

    def __init__(self):
        self.running: bool = True
        self.llama_client = Client()
        self.flask_app = Flask(__name__)
        self.flask_sock = Sock(self.flask_app)
        self.ws: Server = None
        self.db: Database = Database.get()

        self.llama_characters = {x._id:x for x in self.db.get_all_characters()}
        if len(self.llama_characters) == 0:
            base_assistant = Character("Personal AI Assistant", "You are a personal AI assistant.")
            self.llama_characters[base_assistant._id] = base_assistant
            self.db.save_character(base_assistant)
        self.llama_current_character = list(self.llama_characters.values())[0]

        self.conversations = self.db.get_all_conversations()
        self.conversation = Conversation([self.llama_current_character], {}, "New Conversation")

        self.llama_current_model = "deepseek-r1:7b"
        self.llama_models = [
            "deepseek-r1:7b", "deepseek-r1:14b"
        ]

        self.flask_app.static_folder = "../public"
        self.flask_app.template_folder = "../public/templates"
    
    def run_model_stream(self):
        _thread = threading.Thread(target=asyncio.run, args=(self.__run_model_stream(),))
        _thread.start()

    async def __run_model_stream(self):
        messages=[i.message for i in self.conversation.messages.values()]
        intro_text = f"You are {self.llama_current_character.name}.\n {self.llama_current_character.description}"
        messages.insert(-1, Message(role="system", content=intro_text))

        stream = self.llama_client.chat(
            model=self.llama_current_model,
            messages=messages,
            stream=True,
        )

        total_content = ""
        for chunk in stream:
            content: str = chunk['message']['content']
            total_content += content
            self.ws.send(json.dumps({"action": "message", "content": content, "author": self.llama_current_character.name}))

            if not self.ws.connected:
                self.ws.close(1000)
                break
            if not self.running:
                break
            if chunk.done:
                new_message = MessageWrapper(role="assistant", content=total_content, author=self.llama_current_character.name)
                self.conversation.messages[new_message._id] = new_message
                self.ws.send(json.dumps({"action": "done", "_id": new_message._id}))