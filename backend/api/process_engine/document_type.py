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

    def is_valid(self):
        # TODO add validation
        return True