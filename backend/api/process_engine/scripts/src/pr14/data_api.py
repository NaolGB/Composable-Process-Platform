import requests

BASE_URL = 'http://host.docker.internal:8000' 

class DocumentWrapper:
    """
    returns a str(dict) that conforms to the fields of process_instance.document_instances
    """
    def __init__(self, process_id, document_id, data={}) -> None:
        self.process_id = process_id
        self.document_id = document_id
        self.data = data
        self.type = 'document_intance'

    def __str__(self) -> str:
        return str({'type': self.type, 'data': self.data})

class DocumentApi:
    """
    affects the fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, process_type, process_instance_id, document_id):
        self._data = {}
        self.process_instance_id = process_instance_id
        self.process_type = process_type
        self.document_id = document_id
        self.document = None

    def get_document_dict(self):
        """
        returns the requested document instance as a dict
        """
        url = f'{BASE_URL}/operations/operations-detail/process_instance/{self.process_type}'
        response = requests.get(url)
       
        if response.status_code == 200:
            response_data = response.json()['data']
            
            for doc in response_data:
                # print(doc)
                if (doc['_id'] == self.process_instance_id) and (doc['document_instances'].get(self.document_id) != None): 
                    self.document = doc['document_instances'].get(self.document_id)

        return self.document
    
    def is_valid(self):
        return True
    

class DocumentMasterDataApi:
    """
    returns fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, process_id, document_id):
        self._data = {}
        self.process_id = process_id
        self.document_id = document_id

    def get_document_master_data_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        # all_document_instances = self.db.process_instance.find({'_id': self.process_id}, {'document_instances': 1})
        # all_document_instances = json_util.loads(json_util.dumps(all_document_instances))

        # document_instance = None
        # for doc_inst in all_document_instances:
        #     if list(doc_inst['document_instances'].keys())[0] == self.document_id:
        #         document_instance = doc_inst['document_instances'][self.document_id]
        
        # if document_instance != None:
        #     # use only lead_object related fields
        #     document_master_data = document_instance[f'{document_instance["lead_object"]}s']
        
        # return document_master_data

    def is_valid(self):
        return True

class MasterDataApi:
    """
    returns fields of document of a process instance as pandas DataFrame
    """
    def __init__(self, master_data_type_id):
        self._data = {}
        self.master_data_type_id = master_data_type_id

    def get_master_data_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        # all_master_data_instances = self.db[f'{self.master_data_type_id}'].find()
        # all_master_data_instances = json_util.loads(json_util.dumps(all_master_data_instances))

        # all_master_data_instances = {inst['_id']: inst for inst in all_master_data_instances}

        # return all_master_data_instances

    def is_valid(self):
        return True