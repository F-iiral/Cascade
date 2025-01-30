import time

class Character:
    def __init__(self, name: str, description: str, tagline: str):
        self._id: int = int(time.time())
        self.name: str = name
        self.description: str = description
        self.tagline: str = tagline

    def to_json(self) -> dict:
        return {
            "id": self._id,
            "name": self.name,
            "description": self.description,
            "tagline": self.tagline
        }