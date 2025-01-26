from __future__ import annotations
from pymongo import MongoClient
from private.common.character import Character
from private.common.conversation import Conversation
from private.common.message_wrapper import MessageWrapper
import copy

class Database:
    inst: Database = None

    @staticmethod
    def get() -> Database:
        if Database.inst != None:
            return Database.inst
        
        inst = Database("mongodb://localhost:27017/", "tavern")
        Database.inst = inst
        return inst

    def __init__(self, connection_string: str, db_name: str) -> None:
        client = MongoClient(connection_string)
        self.db = client[db_name]
        self.characters = self.db["characters"]
        self.conversations = self.db["conversations"]

        self.characters.create_index("_id")
        self.conversations.create_index("_id")

    def save_character(self, character: Character) -> None:
        self.characters.replace_one({"_id": character._id}, character.__dict__, upsert=True)

    def save_conversation(self, conversation: Conversation) -> None:
        obj1 = conversation.__dict__
        obj2 = copy.copy(conversation.__dict__)
        obj2["characters"] = []
        obj2["messages"] = []

        for character in obj1["characters"]:
            obj2["characters"].append(character._id)
        for message in obj1["messages"].values():
            obj2["messages"].append(message.to_json())
        
        self.conversations.replace_one({"_id": conversation._id}, obj2, upsert=True)
    
    def __load_character(self, data) -> Character:
        new_character = Character(data["name"], data["description"])
        new_character._id = data["_id"]
        return new_character
    
    def __load_conversation(self, data) -> Conversation:
        messages = data["messages"]
        parsed_messages = {}
        for message in messages:
            new_message = MessageWrapper(message["message"]["role"], message["message"]["content"], message["author"])
            new_message._id = message["id"]
            parsed_messages[message["id"]] = new_message

        new_conversation = Conversation([self.get_character(i) for i in data["characters"]], parsed_messages, data["name"])
        new_conversation._id = data["_id"]
        return new_conversation
    
    def get_character(self, id: int) -> Character | None:
        result = self.characters.find_one({"_id": id})
        
        if result == None:
            return None
        return self.__load_character(result)

    def get_conversation(self, id: int) -> Conversation | None:
        result = self.conversations.find_one({"_id": id})
        
        if result == None:
            return None
        return self.__load_conversation(result)
    
    def get_all_characters(self) -> list[Character] | None:
        results = self.characters.find()
        
        if results == None:
            return None
        
        parsed_characters = []
        for result in results: 
            new_character = self.__load_character(result)
            parsed_characters.append(new_character)
        
        return parsed_characters
    
    def get_all_conversations(self) -> list[Conversation] | None:
        results = self.conversations.find()
        
        if results == None:
            return None
        
        parsed_conversations = []
        for result in results: 
            new_conversation = self.__load_conversation(result)
            parsed_conversations.append(new_conversation)
        
        return parsed_conversations