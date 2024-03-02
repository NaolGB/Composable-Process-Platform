from bson import json_util
from .mongo_utils import MongoDBClient

MONGO_CLIENT = MongoDBClient()

class MetaData:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.meta_data

    def create(self, **data):
        data = data['data']
        self.validate()

        self._data = {
            '_id': data['collectionName'],
            'fields': data['fields']
        }

        result = self.collection.insert_one(self._data)

        if result.acknowledged:
            return 200, "Metadata created successfully"
        else:
            return 400, "Failed to create metadata"
    def get(self, id):
        response = self.collection.find({'_id': id})
        response = json_util.loads(json_util.dumps(response))
        
        if response:
            return response
        else:
            raise ValueError("Failed to retrieve metadata")

    def updaate(self, id, update_types)
    def update(self, id, new_fields=None, rename_fields=None):
        """
        Update a document by ID.
        :param id: The ID of the document to update.
        :param new_fields: A dictionary of new fields to add. Each item in the dictionary should have the 'field_name'.
        :param rename_fields: A dictionary of fields to rename. Each item in the dictionary should have the 'field_name' and 'new_field_name'.
        """
        pass

# {
#   "collectionName": "userProfiles",
#   "fields": [
#     {
#       "fieldId": "uuid-1234",
#       "fieldName": "firstName",
#       "dataType": "string",
#       "description": "The user's first name",
#       "editable": true
#     },
#     {
#       "fieldId": "uuid-5678",
#       "fieldName": "lastName",
#       "dataType": "string",
#       "description": "The user's last name",
#       "editable": true
#     },
#     {
#       "fieldId": "uuid-9012",
#       "fieldName": "email",
#       "dataType": "string",
#       "description": "The user's email address",
#       "editable": true,
#       "validation": {
#         "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
#       }
#     },
#     // Additional fields as necessary...
#   ]
# }
