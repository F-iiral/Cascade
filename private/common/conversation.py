import time
from private.common.character import Character
from private.common.message_wrapper import MessageWrapper

class Conversation:
    def __init__(self, characters: list[Character], messages: dict[int, MessageWrapper], name: str):
        self._id: int = int(time.time())
        self.name: str = name
        self.characters: list[Character] = characters
        self.messages: dict[int, MessageWrapper] = messages
    
    def to_json(self) -> dict:
        return {
            "id": self._id,
            "name": self.name,
            "characters": [i.to_json() for i in self.characters],
            "messages": [i.to_json() for i in self.messages.values()]
        }