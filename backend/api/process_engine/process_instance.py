import ast
from bson import json_util
from . import helpers, db_secrets
from .process_type import ProcessType as PT

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()

class ProcessInstance:
    def __init__(self) -> None:
        self._data ={}
        self.db = client['dev']
        self.collection = self.db.process_instance

    def create(self, process_type_id):
        self._data = PT().generate_process_instance_frame(process_type_id=process_type_id)
        
        # assign id to new process instance
        prcs_count = self.collection.count_documents({'process_type': self._data['process_type']})
        prcs_id = (8 - len(str(prcs_count))) * '0' + str(prcs_count)
        self._data['_id'] = helpers.separate_characters(prcs_id)

        if self.is_valid():
            self.collection.insert_one(self._data)
    
    def is_valid(self):
        # TODO add validation
        return True