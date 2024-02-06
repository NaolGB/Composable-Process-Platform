import uuid
from bson import json_util
from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class MasterDtype:
    def __init__(self) -> None:
        self._id = None
        self._data = {}
        self.db = client['dev']
        self.collection = self.db.master_dtype

    def create(self, **data):
        data = data['data']

        self._data = {
            '_id': helpers.name_to_id(data['name']),
            'organization': data['organization'],
            'name': data['name'],
            'attributes': data['attributes']
        }

        if self.is_valid():
            # insert master dtype
            result = self.collection.insert_one(self._data)

            # insert the corresponding source instance collection
            if result.acknowledged:
                result = self.db.create_collection(name=self._data['_id'])

                # create the first entry of the master instance to provide easy access to fields for later operations
                first_entry = {k: v for k, v in self._data['attributes'].items()}
                first_entry['_id'] = f'TEMPLATE---{str(uuid.uuid4())}'
                self.db[f"{self._data['_id']}"].insert_one(first_entry)

        else:
            raise helpers.PEValidationError()

    def get_all_ids(self):
        ids = self.collection.find({}, {'_id': 1})
        ids_list = [str(doc['_id']) for doc in ids]

        return ids_list
    
    def get_master_dtype(self, id):
        response = self.collection.find_one({'_id': id})
        response = json_util.loads(json_util.dumps(response))
        return response

    def is_valid(self):
        # TODO require data['name']
        return True 