from bson import json_util
from process_engine import helpers, db_secrets

client = db_secrets.get_client()

class DocumentApi:
    """
    returns fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, process_id, document_id):
        self._data = {}
        self.db = client['dev']
        self.process_id = process_id
        self.document_id = document_id

    def get_document_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        all_document_instances = self.db.process_instance.find({'_id': self.process_id}, {'document_instances': 1})
        all_document_instances = json_util.loads(json_util.dumps(all_document_instances))

        document_instance = None
        for doc_inst in all_document_instances:
            if list(doc_inst['document_instances'].keys())[0] == self.document_id:
                document_instance = doc_inst['document_instances'][self.document_id]

                # remove lead_object related fields
                for key in ['lead_object', 'lead_object_fields', f'{document_instance["lead_object"]}s']:
                    document_instance.pop(key, None)

        document_instance = {self.document_id: document_instance}
        return document_instance

    def set_document(self, data):
        """
        updates specific fields of a process_instance's document_intances' document_instance
        data must conform to {[key: string]: [value: string]} and be of only document_instance
        """
        result = self.db.process_instance.update_one(
            {'_id': self.process_id},
            {'$set': {f'document_instances.{self.document_id}.{k}': v for k, v in data.items()}}
        )
        

    def is_valid(self):
        return True
    

class DocumentMasterDataApi:
    """
    returns fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, process_id, document_id):
        self._data = {}
        self.db = client['dev']
        self.process_id = process_id
        self.document_id = document_id

    def get_document_master_data_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        all_document_instances = self.db.process_instance.find({'_id': self.process_id}, {'document_instances': 1})
        all_document_instances = json_util.loads(json_util.dumps(all_document_instances))

        document_instance = None
        for doc_inst in all_document_instances:
            if list(doc_inst['document_instances'].keys())[0] == self.document_id:
                document_instance = doc_inst['document_instances'][self.document_id]
        
        if document_instance != None:
            # use only lead_object related fields
            document_master_data = document_instance[f'{document_instance["lead_object"]}s']
        
        return document_master_data
    
    def set_document_master_data(self, document_lead_object, master_data_id, data):
        """
        updates specific fields of a process_instance's document_intances' document_instance's master_data
        data must conform to {[key: string]: [value: string]} and be of only document-instance master_data
        """
        result = self.db.process_instance.update_one(
            {'_id': self.process_id},
            {'$set': {
                f'document_instances.{self.document_id}.{document_lead_object}s.{master_data_id}.{k}': v for k, v in data.items()}
            }
        )

    def is_valid(self):
        return True

class MasterDataApi:
    """
    returns fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, master_data_type_id):
        self._data = {}
        self.db = client['dev']
        self.master_data_type_id = master_data_type_id

    def get_master_data_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        all_master_data_instances = self.db[f'{self.master_data_type_id}'].find()
        all_master_data_instances = json_util.loads(json_util.dumps(all_master_data_instances))

        all_master_data_instances = {inst['_id']: inst for inst in all_master_data_instances}

        return all_master_data_instances
    
    def set_master_data(self, master_data_id, data):
        """
        updates specific fields of a master_data
        data must conform to {[key: string]: [value: string]} and be of only master_data
        """
        result = self.db[f'{self.master_data_type_id}'].update_one(
            {'_id': master_data_id},
            {'$set': {
                f'{k}': v for k, v in data.items()}
            }
        )

    def is_valid(self):
        return True