from __future__ import annotations
import time

class Character:
    def __init__(self, name: str, description: str, tagline: str):
        self._id: int = int(time.time())
        self.name: str = name
        self.description: str = description
        self.tagline: str = tagline
        self.avatarLink: str | None = None

    @staticmethod
    def get_base_character() -> Character:
        base_assistant = Character("Personal AI Assistant", "You are a personal AI assistant.", "A personal AI assistant.")
        base_assistant._id = 0
        return base_assistant

    def to_json(self) -> dict:
        return {
            "id": self._id,
            "name": self.name,
            "description": self.description,
            "tagline": self.tagline,
            "avatar": self.avatarLink
        }