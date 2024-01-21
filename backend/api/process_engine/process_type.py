from bson import json_util
from . import helpers, db_secrets

client = db_secrets.get_client() #TODO manage methods to create client better - maybe one client instance per org
class ProcessStep:
    def __init__(self) -> None:
        self._id = None
        self._options = {}
        self._next_steps = []
        self._row = 0 # for process graph
        self._column = 0 # for process graph

    def serialize(self):
        serialized_step = {
            "options": self._options,
            "next_steps": {
                
            },
            "row": self._row,
            "column": self._column
        }

        return serialized_step

    def deserialize(self):
        pass

    def generate(self, step_name: str):
        self._id = step_name
        self._options = {
            "cancel":{
                "label": "Cancel",
                "actions": {}
            },
            "save":{
                "label": "Save",
                "actions": {}
            }
        }

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
        self._data = {}

    def serialize(self):
        serialized_process = {
            '_id': self._id,
            'organization': self._organization,
            'design_status': self._design_status,
            'attributes': self._attributes
        }

        return serialized_process

    # def deserialize(self, **data):
    #     pass

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
    
    # Next Steps functions
    def put_process(self, id, **data): 
        self._data = data['data'] # data comes as a value of a dict with key of 'data'

        if self.is_valid():
            self.update_process_design_status()
            self.collection.update_one({"_id": id}, {"$set":self._data}) # TODO find a better way to updaete new adn existing updated fields only

    def update_process_design_status(self):
        # check if all steps are connected, but without all requirements added
        all_steps = [k for k, _ in self._data['attributes']['steps'].items()]
        connected_steps = []

        for step in all_steps:
            next_steps = self._data['attributes']['steps'][step]['next_steps'].keys()
            if len(next_steps) != 0:
                connected_steps.append(step)
                connected_steps += next_steps
        
        connected_steps = list(set(connected_steps))
        
        if (len(connected_steps) == len(all_steps)):
            self._data['design_status'] = '01_CONNECTED_NOT_REQUIREMENT_COMPLETED'
       

    def is_valid(self):
        # TODO add validation
        return True
