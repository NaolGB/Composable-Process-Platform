import ast
from bson import json_util
from . import helpers, db_secrets
from .process_instance import ProcessInstance as PI

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()

class ProcessEvent:
    def __init__(self) -> None:
        self._data = {}
        self.db = client['dev']
        self.collection = self.db.event
        pass

    def create_process_instance(self, process_type_id):
        PI().create(process_type_id=process_type_id)

    def on_click_save(self, current_step, process):
        """
        - process is the entire process as json, passed from the frontend
        - current_step is the step within the given process, it is used for determining 
            which automated steps to take
        """
        if process[current_step][''] == 'update':
            # apply manual actions
            # apply automated actions
            # update process operations_status
            # update event status
            # put to db
            # update event status
            pass

    def record_event(self):
        pass

    def is_valid(self):
        pass