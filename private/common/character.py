import time

class Character:
    def __init__(self, name: str, description: str):
        self.name: str = name
        self.description: str = description
        self.id: int = int(time.time())

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "id": self.id
        }