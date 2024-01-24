import ast
from bson import json_util
from . import helpers, db_secrets

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()


class ProcessStep:
    def __init__(self) -> None:
        self._data = {}

    def generate(self, step_name: str):
        self._data['_id'] = helpers.name_to_id(step_name)
        self._data['options'] = {
            "cancel": {
                "label": "Cancel",
                "actions": {}
            },
            "save": {
                "label": "Save",
                "actions": {}
            }
        }
        self._data['next_steps'] = {
            "steps": [],
            "requirement": ""
        }
        self._data["row"] = 0
        self._data["column"] = 0

        return self._data

    def is_valid(self):
        pass


class ProcessType:
    def __init__(self) -> None:
        self._data = {}
        self.db = client['dev']
        self.collection = self.db.process_type

    def create(self, **data):
        data = data['data']

        self._data = {
            '_id': helpers.name_to_id(data['name']),
            'organization': data['organization'],
            'documents': data['documents'],
            'design_status': data['design_status'],
            'steps': {}
        }

        parsed_steps = data['steps'].split(',')
        parsed_steps = [s.strip() for s in parsed_steps]
        for step in parsed_steps:
            self._data['steps'][step] = ProcessStep().generate(step_name=step)

        if self.is_valid():
            self.collection.insert_one(self._data)

    def get_all_ids(self):
        ids = self.collection.find({}, {'_id': 1})
        ids_list = [str(doc['_id']) for doc in ids]

        return ids_list

    def get_process(self, processId):
        prcs = self.collection.find({'_id': processId})
        prcs = json_util.loads(json_util.dumps(prcs))[0]
        self._data = prcs

        self.update_transition_requirement_to_get()

        return self._data

    def put_process(self, id, **data):
        # data comes as a value of a dict with key of 'data'
        self._data = data['data']

        if self.is_valid():
            self.update_process_design_status()
            self.update_transition_requirement_to_put()

            # TODO find a better way to updaete new adn existing updated fields only
            self.collection.update_one({"_id": id}, {"$set": self._data})

    def update_process_design_status(self):
        # check if all steps are connected, but without all requirement added
        all_steps = [k for k, _ in self._data['steps'].items()]
        connected_steps = []

        for step in all_steps:
            next_steps = self._data['steps'][step]['next_steps']['steps']
            if len(next_steps) != 0:
                connected_steps.append(step)
                connected_steps += next_steps

        connected_steps = list(set(connected_steps))

        if (len(connected_steps) == len(all_steps)):
            self._data['design_status'].append(
                '01_CONNECTED_NOT_REQUIREMENT_COMPLETED')
        elif (len(connected_steps) != len(all_steps)):
            self._data['design_status'].remove(
                '01_CONNECTED_NOT_REQUIREMENT_COMPLETED')
            
    def update_transition_requirement_to_put(self):
        # TODO update design status
        
        # sanitize code
        all_steps = [k for k, _ in self._data['steps'].items()]

        for step in all_steps:
            next_steps = self._data['steps'][step]['next_steps']['steps']
            if len(next_steps) != 0:
                code_content = self._data['steps'][step]['next_steps']['requirement']
                code_content = helpers.get_b64_text(code_content)
                self._data['steps'][step]['next_steps']['requirement'] = code_content

    def update_transition_requirement_to_get(self):
        all_steps = [k for k, _ in self._data['steps'].items()]

        for step in all_steps:
            next_steps = self._data['steps'][step]['next_steps']['steps']
            if len(next_steps) != 0:
                code_content = self._data['steps'][step]['next_steps']['requirement']
                code_content = helpers.get_plain_text(code_content)
                self._data['steps'][step]['next_steps']['requirement'] = code_content


    def is_valid(self):
        # TODO add validation
        return True
