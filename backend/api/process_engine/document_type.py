from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class DocumentType:
    def __init__(self) -> None:
        self._id = None
        self._organization = None
        self._transaction_type = None
        self.db = client['dev']
        self.collection = self.db.document_type

    def serialize(self):
        serialized_data = {
            '_id': self._id,
            'organization': self._organization,
            'transaction_type': self._transaction_type
        }

        return serialized_data

    def deserialize(self, **data):
        if( data.get('organization') == None) or ( data.get('attributes') == None):
            raise helpers.PEAttributeNotFoundError()
        if len(list(data.keys())) > 2:
            raise helpers.PETooManyAttributesError()
        
        self._id = helpers.name_to_id(data['attributes']['name'])
        self._organization = data['organization']
        self._transaction_type = data['attributes']['']

    def create(self, **data):
        pass

    def is_valid(self):
        # TODO add validation
        return True