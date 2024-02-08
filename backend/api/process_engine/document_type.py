from bson import json_util
from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class DocumentType:
    def __init__(self) -> None:
        self._data= None
        self._organization = None
        self._transaction_type = None
        self.db = client['dev']
        self.collection = self.db.document_type

    def create(self, **data):
        if self.is_valid():
            self._data = data['data']
            self._data['_id'] = helpers.name_to_id(self._data['name'])
            
            result = self.collection.insert_one(self._data)
        else:
            raise helpers.PEValidationError()
        
    def get_all_ids(self):
        ids = self.collection.find({}, {'_id': 1})
        ids_list = [doc['_id'] for doc in ids]

        return ids_list
    
    def get_document_type(self, documentId):
        document_type = self.collection.find({'_id': documentId})
        document_type = json_util.loads(json_util.dumps(document_type))[0]
        self._data = document_type

        return self._data
    
    def generate_document_instance_frame(self, document_id):
        self.get_document_type(documentId=document_id)

        lead_object = self._data['lead_object']

        columns = self.db[lead_object].find({'_id': {"$regex": "^TEMPLATE---"}})
        columns = json_util.loads(json_util.dumps(columns, default=str))

        if self.is_valid():
            instance_frame = {
                "name": self._data['name'],
                "lead_object": lead_object,
                "lead_object_fields" : helpers.extract_unqiue_columns(columns),
                f"{self._data['lead_object']}s": {}
            }
        # print(self._data['extra_attributes'].items())
            for k, dtype in self._data['attributes'].items():
                instance_frame[k] = ""

            return instance_frame

    def is_valid(self):
        # TODO add validation
        return True