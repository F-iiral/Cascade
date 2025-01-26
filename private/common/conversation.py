import time
from private.common.character import Character
from private.common.message_wrapper import MessageWrapper

class Conversation:
    def __init__(self, characters: list[Character], messages: dict[int, MessageWrapper]):
        self.id: int = int(time.time())
        self.name: str = "New Conversation"
        self.characters: list[Character] = characters
        self.messages: dict[int, MessageWrapper] = messages
    
    def to_json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "characters": [i.to_json() for i in self.characters],
            "messages": [i.to_json() for i in self.messages]
        }