import time

class Character:
    def __init__(self, name: str, description: str):
        self.id: int = int(time.time())
        self.name: str = name
        self.description: str = description

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }