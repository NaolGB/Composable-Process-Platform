import os
import uuid
from .mongo_utils import MongoDBClient
from .helpers import name_to_id, ProcessEngineResponse, ProcessEngineValidator

MONGO_CLIENT = MongoDBClient()
ORGANIZATION = os.environ.get('ORGANIZATION')

class MasterDataType:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.master_data_type
        self._data = {}

    def create(self, **data):
        data = data['data'] # Unpack the data
        self._data = data

        # validate data
        validation_response = self._validate_create()
        if validation_response.success == False:
            return validation_response

        # attribute map to reffer to data[attrbute] by uuid
        master_data_type_id = name_to_id(self._data['display_name'])

        # add identifiers
        self._data['_id'] = master_data_type_id
        self._data['organization'] = ORGANIZATION
        
        result = self.collection.insert_one(self._data)
        if result.acknowledged:
            return ProcessEngineResponse(success=True, data=data['display_name'])
        else:
            return ProcessEngineResponse(success=False, message="Failed to create master data")

    def update(self, id, **data):
        if not id:
            return ProcessEngineResponse(success=False, message="ID field is required")
        
        attributes = data['data']['attributes']

        if not attributes:
            return ProcessEngineResponse(success=False, message="Attributes field is required")
        
        # validate data
        validation_response = self._validate_update(attributes)
        if validation_response.success == False:
            return validation_response
        
        result = self.collection.update_one({'_id': id}, {'$set': {'attributes': attributes}})
        if result.acknowledged:
            return ProcessEngineResponse(success=True, data=attributes)
        else:
            return ProcessEngineResponse(success=False, message="Failed to update master data")

    def get(self, id=None, fields=None):
        # Default response for "not found" or "empty"
        result = 'Document(s) not found'

        if id:
            query = {'_id': id}
            if fields:
                projection = {field: 1 for field in fields}
                result = self.collection.find_one(query, projection=projection)
            else:
                result = self.collection.find_one(query)
            
            if result:
                return ProcessEngineResponse(success=True, data=result)
            else:
                return ProcessEngineResponse(success=False, message="Document not found")
        else:
            if fields:
                projection = {field: 1 for field in fields}
                cursor = self.collection.find({}, projection=projection)
            else:
                cursor = self.collection.find()
            result = list(cursor)
            
            if result:
                return ProcessEngineResponse(success=True, data=result)
            else:
                return ProcessEngineResponse(success=False, message="Documents not found")

    def _validate_create(self):
        validator = ProcessEngineValidator()

        validation = validator.data_has_attributes(self._data, ['display_name', 'attributes'])
        if not validation.success:
            return validation
        
        validation = validator.data_has_unique_attributes(self._data)
        if not validation.success:
            return validation  
        
        validation = validator.data_has_unique_attributes(self._data['attributes'])
        if not validation.success:
            return validation
        
        for attribute, attribute_data in self._data['attributes'].items():
            validation = validator.data_has_attributes(attribute_data, ['display_name', 'type', 'is_required', 'default_value'])
            if not validation.success:
                return validation
        
        return ProcessEngineResponse(success=True)
    
    def _validate_update(self, data):
        validator = ProcessEngineValidator()

        validation = validator.data_has_unique_attributes(data)
        if not validation.success:
            return validation
        
        for attribute, attribute_data in data.items():
            validation = validator.data_has_attributes(attribute_data, ['display_name', 'type', 'is_required', 'default_value'])
            if not validation.success:
                return validation
            
        return ProcessEngineResponse(success=True)