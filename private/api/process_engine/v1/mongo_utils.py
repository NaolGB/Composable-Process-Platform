from pymongo import MongoClient
import os

class MongoDBClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBClient, cls).__new__(cls)
            mongo_uri = os.getenv('MONGO_DB_URI')
            cls._instance.client = MongoClient(mongo_uri)
        return cls._instance.client

