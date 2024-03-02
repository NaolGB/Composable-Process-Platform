from .mongo_utils import MongoDBClient

MONGO_CLIENT = MongoDBClient()

class MasterDataType:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.master_data_type

    def create(self, **data):
        pass

    def update(self, **params):
        pass

    def get(self, **params):
        pass

class MasterDataInstance:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.master_data_instance

    def create(self, **data):
        pass

    def update(self, **params):
        pass

    def get(self, **params):
        pass