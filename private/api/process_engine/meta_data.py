from .mongo_utils import MongoDBClient

MONGO_CLIENT = MongoDBClient()

class MetaData:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.meta_data


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
