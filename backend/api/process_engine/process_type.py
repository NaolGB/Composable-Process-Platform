from bson import json_util
from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class ProcessOption:
    def __init__(self, **data) -> None:
        self._option_type = None
        self._label = None
        self._action = None

    def serialize(self):
        serialized_option = {
            "label": self._label,
            "action": self._action
        }

        return serialized_option

    def deserialize(self):
        pass

    def generate(self):
        self._option_type = "cancel"
        self._label = "Cancel"
        self._action = {}

        return self.serialize()

    def is_valid(self):
        return True


class ProcessStep:
    def __init__(self) -> None:
        self._id = None
        self._options = {}
        self._next_steps = []

    def serialize(self):
        serialized_step = {
            "options": self._options,
            "next_steps": {
                
            }
        }

        return serialized_step

    def deserialize(self):
        pass

    def generate(self, step_name: str):
        self._id = step_name
        default_process_option = ProcessOption()
        serialized_default_process_option = default_process_option.generate()
        self._options[default_process_option._option_type] = serialized_default_process_option

        return self.serialize()

    def is_valid(self):
        pass


class ProcessType:
    def __init__(self) -> None:
        self._id = None
        self._organization = None
        self._attributes = None
        self._design_status = None
        self.db = client['dev']
        self.collection = self.db.process_type

    def serialize(self):
        serialized_process = {
            '_id': self._id,
            'organization': self._organization,
            'design_status': self._design_status,
            'attributes': self._attributes
        }

        return serialized_process

    def deserialize(self, **data):
        pass

    def create(self, **data):
        """
        takes process steps as lsit and generates process steps
        """
        if (data.get('organization') == None):
            raise helpers.PEAttributeNotFoundError()
        if len(data.keys()) > 5:
            raise helpers.PETooManyAttributesError()

        self._id = helpers.name_to_id(data['name']) # NOTE we are using name as _id
        self._organization = data['organization']
        self._design_status = data['design_status']

        self._attributes = {
            'organization': data['organization'],
            'documents': data['documents'],
            'status': "NOT_INITIATED",
            'steps': {}
        }

        # parase and vaildate steps
        assert type(data['steps']) == str
        parsed_steps = data['steps'].split(',')
        parsed_steps = [s.strip() for s in parsed_steps]
        for step in parsed_steps:
            self._attributes['steps'][step] = ProcessStep().generate(step_name=step)

        if self.is_valid():
            self.collection.insert_one(self.serialize())

    def get_all_ids(self):
        ids = self.collection.find({}, {'_id': 1})
        ids_list = [str(doc['_id']) for doc in ids]

        return ids_list
    
    def get_process(self, processId):
        prcs = self.collection.find({'_id': processId})
        prcs = json_util.loads(json_util.dumps(prcs))[0]
        
        return prcs
    
    def is_valid(self):
        # TODO add validation
        return True
