import uuid
from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class MasterDtype:
    def __init__(self) -> None:
        self._id = None
        self._organization = None
        self._attributes = None
        self.db = client['dev']
        self.collection = self.db.master_dtype


    def serialize(self):
        serialized_data = {
            '_id': self._id,
            'organization': self._organization,
            'attributes': self._attributes
        }

        return serialized_data


    def deserialize(self,  **data):
        if( data.get('organization') == None) or ( data.get('attributes') == None):
            raise helpers.PEAttributeNotFoundError()
        if len(list(data.keys())) > 2:
            raise helpers.PETooManyAttributesError()
        
        self._id = data['attributes']['name'] # NOTE we are using name as _id
        self._organization = data['organization']
        self._attributes = data['attributes']


    def create(self, **data):
        self.deserialize(**data)
        if self.is_valid():
            self.collection.insert_one(self.serialize())
        else:
            raise helpers.PEValidationError()

    def is_valid(self):
        return True # TODO