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
    # event1: {
	# 	name: "create sales order",
	# 	type_of_event: "create",
	# 	manual_actions: {
	# 		user_name: "usera",
	# 		timestamp: "01/03/2009 03:02:00.112"
	# 		status: "applied on db"
	# 	}
	# 	automated_acitons: {
	# 		timestamp: "01/03/2009 03:02:00.112"
	# 		status: "applied on db"  // another option - "failed to apply on db"
	# 	},
	# 	process_id: "pr_a".
	# }
        pass

    def create_process_instance(self, process_type_id):
        PI().create(process_type_id=process_type_id)

    def record_event(self):
        pass

    def is_valid(self):
        pass