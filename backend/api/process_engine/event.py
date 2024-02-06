import uuid
from datetime import datetime
import ast
from bson import json_util
from . import helpers, db_secrets
from .process_instance import ProcessInstance

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()

class ProcessEvent:
    def __init__(self, user_name) -> None:
        self._data = {}
        self.user_name = user_name
        self.db = client['dev']
        self._collection = self.db.events
        pass

    def get_data_details(self, dtype, id):
        if dtype == 'master_instance':
            temp_collection = self.db[f'{id}']

            # HACK skip _id fields becasue sometimes they are BSON ObjectID which is not JSON serializable
            result = temp_collection.find({}, {'_id': 0}) 
            result = json_util.loads(json_util.dumps(result, default=str))
            temp_collection = None
            
            metadata = {
                "columns": helpers.extract_unqiue_columns(result)
            }
            
            return {"data": result, "metadata": metadata}
        else:
            raise helpers.PEPlaceholderError()
        
    def post_data_details(self, dtype, id, data):
        if dtype == 'master_instance':
            temp_collection = self.db[f'{id}']

            if data.get('name', None):
                data['_id'] = helpers.name_to_id(data['name'])
            else:
                data['_id'] = str(uuid.uuid4())

            result = temp_collection.insert_one(data)
            temp_collection = None

            event_actions = {
                "user_name": self.user_name,
                "timestamp": datetime.utcnow(),
                "status": "OK"
            }
            self.record_event(
                event_name=f'create master instance', 
                event_type='create', 
                data_type='master_instance', 
                data_id=id,
                actions=event_actions
            )
        else:
            raise helpers.PEPlaceholderError()

    def create_process_instance(self, process_type_id):
        ProcessInstance().create(process_type_id=process_type_id)

    def record_event(self, event_name, event_type, data_type, data_id, actions):
        event = {
            "_id": str(uuid.uuid4()),
            "name": event_name, 
            "event_type": event_type,
            "data_type": data_type,
            "data_id": data_id,
            "actions": actions
        }
        self._collection.insert_one(event)

    def is_valid(self):
        pass