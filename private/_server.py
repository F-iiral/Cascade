from __future__ import annotations
from private.message_wrapper import MessageWrapper
from flask import Flask
from flask_sock import Sock, Server
from ollama import Client
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
        self.llama_messages: dict[float, MessageWrapper] = {}
        self.flask_app = Flask(__name__)
        self.flask_sock = Sock(self.flask_app)
        self.ws: Server = None

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
        messages=[i.message for i in self.llama_messages.values()]

        stream = self.llama_client.chat(
            model=self.llama_current_model,
            messages=messages,
            stream=True,
        )

        total_content = ""
        for chunk in stream:
            content: str = chunk['message']['content']
            total_content += content
            self.ws.send(json.dumps({"action": "message", "content": content, "author": "Assistant"}))

            if not self.ws.connected:
                self.ws.close(1000)
                break
            if not self.running:
                break
            if chunk.done:
                new_message = MessageWrapper(role="assistant", content=total_content, author="Assistant")
                self.llama_messages[new_message.timestamp] = new_message
                self.ws.send(json.dumps({"action": "done"}))