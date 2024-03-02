from bson import json_util
from pymongo.operations import UpdateOne
from .mongo_utils import MongoDBClient

MONGO_CLIENT = MongoDBClient()

class MetaData:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.meta_data
        self._data = {}

    def create(self, **data):
        self._data = data['data']
        
        try:
            self.validate()
        except ValueError as e:
            raise ValueError(str(e))
        
        result = self.collection.insert_one(self._data)

        if not result.acknowledged:
            raise ValueError("Failed to create metadata")
        
    def get(self, id):
        response = self.collection.find({'_id': id})
        response = json_util.loads(json_util.dumps(response))
        
        if response:
            return response
        else:
            raise ValueError("Failed to retrieve metadata")

    def update(self, id, update_type, fields):
        """
        Update a document by ID.
        :param update_type: The type of update to perform. Options are 'extend' and 'rename'.
        :param id: The ID of the document to update.
        :param fields: A dictionary of new fields to add or rename. Each item in the dictionary should have the {field_id, field_name, field_type}.
            fields = 
                extend: [{field_id, field_name, field_type}]
                rename: [{field_id, field_name}]}
        """
        if update_type == 'extend':
            bulk_updates = []
            for field in fields:
                bulk_updates.append(
                    UpdateOne(
                        {'_id': id},
                        {'$push': {'fields': field}}
                    )
                )
            # make sure equal number of updates were made
            if len(bulk_updates) > 0:
                result = self.collection.bulk_write(bulk_updates)
                if (not result.acknowledged) or (result.modified_count != len(bulk_updates)):
                    raise ValueError("Failed to update all or any metadata")
        elif update_type == 'rename':
            bulk_updates = []
            for field in fields:
                bulk_updates.append(
                    UpdateOne(
                        {'_id': id, 'fields.field_id': field['field_id']},
                        {'$set': {'fields.$.field_name': field['field_name']}}
                    )
                )
            # make sure equal number of updates were made
            if len(bulk_updates) > 0:
                result = self.collection.bulk_write(bulk_updates)
                if (not result.acknowledged) or (result.modified_count != len(bulk_updates)):
                    raise ValueError("Failed to update all or any metadata")
        else:
            raise ValueError("Invalid update type")

    def validate(self):
        required_fields = ['_id', 'collection_name', 'fields']
        for field in required_fields:
            if field not in self._data:
                raise ValueError(f"Missing required field: {field}")
            
        for field in self._data['fields']:
            if ('field_id' not in field) or ('field_name' not in field) or ('field_type' not in field):
                raise ValueError("Invalid field format: field_id, field_name, and field_type are required attributes")
        