from __future__ import annotations
from ollama import Message
from typing import Literal
import time

class MessageWrapper:
    def __init__(self, role: Literal['user', 'assistant', 'system', 'tool'], content: str, author: str, id: float|None=None):
        self.message: Message = Message(role=role, content=content)
        self.author = author

        if id != None:
            self._id = id
        else:
            self._id = int(time.time())

    def to_json(self) -> dict:
        return {
            "message": {
                "role": self.message.role,
                "content": self.message.content
            },
            "author": self.author,
            "id": self._id
        }