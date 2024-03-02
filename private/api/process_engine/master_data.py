import os
import uuid
from .mongo_utils import MongoDBClient
from .meta_data import MetaData
from .helpers import name_to_id, ProcessEngineResponse

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
        validation_response = self.validate()
        if validation_response.success == False:
            return validation_response

        # attribute map to reffer to data[attrbute] by uuid
        attribute_map = {str(uuid.uuid4()): k for k in self._data['attributes'].keys()}
        master_data_type_id = name_to_id(self._data['name'])

        self._data = {
            '_id': master_data_type_id,
            'organization': ORGANIZATION,
            'name': data['name'],
            'attributes': [element for element in attribute_map.keys()]
        }

        # create meta data
        meta_data = {
            '_id': master_data_type_id,
            'collection_name': 'master_data_type',
            'fields': [
                {
                    'field_id': k,
                    'field_name': v,
                    'field_type': data['attributes'][v],
                } for k, v in attribute_map.items()
            ]
        }

        meta_data_response = MetaData().create(data=meta_data)
        if meta_data_response.success == False:
            return meta_data_response
        
        result = self.collection.insert_one(self._data)
        if result.acknowledged:
            return ProcessEngineResponse(success=True, data=data['name'])
        else:
            return ProcessEngineResponse(success=False, message="Failed to create master data")

    def update(self, id, new_fields=None, rename_fields=None):
        """
        Update a document by ID.
        :param id: The ID of the document to update.
        :param new_fields: A dictionary of new fields to add. Each item in the dictionary should have the 'field_name'.
            new_fields = {new_field_name: new_field_type, ...}
        :param rename_fields: A list of dictionaries, each mapping a 'field_id' to a new 'field_name'.
            rename_fields = [{'field_id': new_field_name}, ...]
        """
        if not id:
            return ProcessEngineResponse(success=False, message="ID field is required")

        # Update the metadata document
        if new_fields:
            added_fields_attribute_map = {str(uuid.uuid4()): k for k in new_fields.keys()}
            meta_data_fields = []
            for k, v in added_fields_attribute_map.items():
                meta_data_fields.append({
                    'field_id': k,
                    'field_name': v,
                    'field_type': new_fields[v],
                })
            meta_data_response = MetaData().update(id, 'extend', meta_data_fields)
            if meta_data_response.success == False:
                return ProcessEngineResponse(success=False, message="Failed to extend metadata")

        # Rename fields in the metadata document
        if rename_fields:
            for rename_field in rename_fields:
                for field_id, new_field_name in rename_field.items():
                    meta_data_fields = []
                    meta_data_fields.append({
                        'field_id': field_id,
                        'field_name': new_field_name,
                    })
            meta_data_response = MetaData().update(id, 'rename', meta_data_fields)
            if meta_data_response.success == False:
                return ProcessEngineResponse(success=False, message="Failed to rename fields in metadata")

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

    def validate(self):
        attributes = self._data.get('attributes', None)
        if not attributes:
            return ProcessEngineResponse(success=False, message="Data must have attributes")
        
        lowercase_keys = map(str.lower, self._data['attributes'].keys())
        if len(attributes) != len(set(lowercase_keys)):
            return ProcessEngineResponse(success=False, message="Attribute keys must be unique regardless of the case")

        if 'name' not in map(str.lower, self._data.keys()):
            return ProcessEngineResponse(success=False, message="Data must include the field 'name'")
        
        return ProcessEngineResponse(success=True)
        
        
