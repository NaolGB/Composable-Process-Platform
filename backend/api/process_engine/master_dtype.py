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
            
        self._id = helpers.name_to_id(data['attributes']['name']) # NOTE we are using name as _id
        self._organization = data['organization']
        self._attributes = data['attributes']


    def create(self, **data):
        self.deserialize(**data)
        if self.is_valid():
            # insert master dtype
            result = self.collection.insert_one(self.serialize())

            # insert the corresponding source instance collection
            if result.acknowledged:
                result = self.db.create_collection(name=self._id)

            # print(result.database.name)
                
            # if result.acknowledged:
            #     pass
            #     # return success message
            # else:
            #     pass
            #     # return error message



            # create source instance for new master dtype
            # if response != None:
                # material_object = {
                #     organization: "SC1",
                #     attributes: {
                #         organization: "string", // set default to organization's name
                #         name: "string", // set default to 'name'
                #         quantity: "float", // set default to 0.0
                #         plant: "object"
                #     }
                # }

            #     mat1: {
            #     organization: "SC1",
            #     name: "Mac Book Air (2020)",
            #     quantity: 156.0,
            #     plant: "pl1"
            # },

        else:
            raise helpers.PEValidationError()
        
    # def create_source_instance(self):
    #     if self.is_valid():


    def is_valid(self):
        # TODO require data['name']
        return True 