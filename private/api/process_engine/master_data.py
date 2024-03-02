import os
import uuid
from .mongo_utils import MongoDBClient
from .meta_data import MetaData

MONGO_CLIENT = MongoDBClient()
ORGANIZATION = os.environ.get('ORGANIZATION')
class MasterDataType:
    def __init__(self) -> None:
        self.db = MONGO_CLIENT.dev
        self.collection = self.db.master_data_type
        self._data = {}

    def create(self, **data):
        self._data = data['data']

        # validate data
        try:
            self.validate()
        except ValueError as e:
            raise ValueError(str(e))

        # attribute map to reffer to data[attrbute] by uuid
        attribute_map = {str(uuid.uuid4()): k for k in self._data['attributes'].keys()}
        master_data_type_id = str(uuid.uuid4())

        self._data = {
            '_id': master_data_type_id,
            'organization': ORGANIZATION,
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
        if meta_data_response != 200:
            raise ValueError("Failed to create meta data")
        
        result = self.collection.insert_one(self._data)
        if result.acknowledged:
            return "Master data created successfully"
        else:
            raise ValueError("Failed to create master data")

    def update(self, id, new_fields=None, rename_fields=None):
        """
        Update a document by ID.
        :param id: The ID of the document to update.
        :param new_fields: A dictionary of new fields to add. Each item in the dictionary should have the 'field_name'.
        :param rename_fields: A list of dictionaries, each mapping a 'field_id' to a new 'field_name'.
        """
        if not id:
            raise ValueError("ID is required for update operation")
        
        # Fetch the existing document
        existing_doc = self.collection.find_one({'_id': id})
        if not existing_doc:
            raise ValueError("Document not found")

        # Update the metadata document
        added_fields_attribute_map = {str(uuid.uuid4()): k for k in new_fields.keys()}
        meta_data = MetaData().get(id)
        if meta_data:
            for k, v in added_fields_attribute_map.items():
                meta_data['fields'].append({
                    'field_id': k,
                    'field_name': v,
                    'field_type': new_fields[v],
                })
            meta_data_response = MetaData().update(existing_doc['_id'], data=meta_data)
            if meta_data_response != 200:
                raise ValueError("Failed to update metadata document")

        # Rename fields in the metadata document
        if rename_fields:
            for rename_field in rename_fields:
                for field_id, new_field_name in rename_field.items():
                    # Assuming you have a separate method or logic to update the field name in the metadata document
                    meta_data_response = self.update_metadata_field_name(field_id, new_field_name)
                    if meta_data_response != 200:
                        raise ValueError(f"Failed to rename field {field_id}")
                    updated = True

        if updated:
            # Update the document in the collection if there were any changes
            result = self.collection.update_one({'_id': id}, {'$set': {'attributes': existing_doc['attributes']}})
            if result.matched_count:
                return "Document updated successfully"
            else:
                raise ValueError("Failed to update the document")
        else:
            # No updates were made
            return "No updates were necessary"

        # update metadata field name



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
                return result
            else:
                raise ValueError("Document not found")
        else:
            if fields:
                projection = {field: 1 for field in fields}
                cursor = self.collection.find({}, projection=projection)
            else:
                cursor = self.collection.find()
            result = list(cursor)
            
            if result:
                return result
            else:
                raise ValueError("Documents not found")

    def validate(self):
        attributes = self._data.get('attributes', None)
        if not attributes:
            raise ValueError("Data must have attributes")
        
        lowercase_keys = map(str.lower, self._data['attributes'].keys())
        if len(attributes) != len(set(lowercase_keys)):
            raise ValueError("Attribute keys must be unique regardless of the case")

        if 'name' not in map(str.lower, self._data['attributes'].keys()):
            raise ValueError("Attributes must include the field 'name'")
