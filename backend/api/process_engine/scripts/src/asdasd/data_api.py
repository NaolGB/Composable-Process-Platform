import requests

BASE_URL = 'http://host.docker.internal:8000' 
# BASE_URL = 'http://localhost:8000'


class DocumentWrapper:
    """
    returns a str(dict) that conforms to the fields of process_instance.document_instances
    """
    def __init__(self, process_type, process_instance_id, document_id, data={}) -> None:
        self.process_type = process_type
        self.process_instance_id = process_instance_id
        self.document_id = document_id
        self.data = data
        self.type = 'document_wrapper'

        self.metadata = {
            'process_type': self.process_type,
            'process_instance_id': self.process_instance_id,
            'document_id': document_id,
            'type': self.type
        }

    def __str__(self) -> str:
        return str({'metadata': self.metadata, 'data': self.data})
    
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
                if (doc['_id'] == self.process_instance_id) and (doc['document_instances'].get(self.document_id) != None):
                    self.document = doc['document_instances'].get(self.document_id)

        return self.document
    

class DocumentMasterDataWrapper:
    """
    returns a str(dict) that conforms to the fields of process_instance.document_instances
    """
    def __init__(self, process_instance_id, document_id, master_data_id, data={}) -> None:
        self.process_instance_id = process_instance_id
        self.document_id = document_id
        self.master_data_id = master_data_id
        self.data = data
        self.type = 'document_master_data_wrapper'

        self.metadata = {
            'process_instance_id': self.process_instance_id,
            'document_id': self.document_id,
            'master_data_id': self.master_data_id,
            'type': self.type
        }

    def __str__(self) -> str:
        return str({'metadata': self.metadata, 'data': self.data})
    
class DocumentMasterDataApi:
    """
    returns fields of master data of document of a process instance as dict
    """
    def __init__(self, process_type, process_instance_id, document_id):
        self._data = {}
        self.process_type = process_type
        self.process_instance_id = process_instance_id
        self.document_id = document_id
        self.document_master_data = None

    def get_document_master_data_dict(self):
        """
        returns the requested document instance as a pd.DataFrame
        """
        url = f'{BASE_URL}/operations/operations-detail/process_instance/{self.process_type}'
        response = requests.get(url)
       
        if response.status_code == 200:
            response_data = response.json()['data']
            
            for doc in response_data:
                if (doc['_id'] == self.process_instance_id) and (doc['document_instances'].get(self.document_id) != None):
                    self.document = doc['document_instances'].get(self.document_id)

            if self.document != None:
                self.document_master_data = self.document[f"{self.document['lead_object']}s"]

        return self.document_master_data


class MasterDataWrapper:
    """
    returns a str(dict) that conforms to the fields of process_instance.document_instances
    """
    def __init__(self,master_data_type, master_data_id, data={}) -> None:
        self.master_data_type = master_data_type
        self.master_data_id = master_data_id
        self.data = data
        self.type = 'master_data_wrapper'

        self.metadata = {
            'master_data_type': self.master_data_type,
            'master_data_id': self.master_data_id,
            'type': self.type
        }

    def __str__(self) -> str:
        return str({'metadata': self.metadata, 'data': self.data})
    
class MasterDataApi:
    """
    returns fields of master data as dict
    """
    def __init__(self, master_data_type, master_data_id):
        self._data = {}
        self.master_data_type = master_data_type
        self.master_data_id = master_data_id
        self.master_data = None

    def get_master_data_dict(self):
        url = f'{BASE_URL}/operations/operations-detail/master_instance/{self.master_data_type}'
        response = requests.get(url)

        if response.status_code == 200:
            response_data = response.json()['data']

            for master in response_data:
                if (master['_id'] == self.master_data_id):
                    self.master_data = master
        
        return self.master_data