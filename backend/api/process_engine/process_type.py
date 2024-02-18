import ast
import os
import uuid
from bson import json_util
from . import helpers, db_secrets
from .document_type import DocumentType

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()
CURRENT_DIRECTORY = os.path.abspath(os.path.dirname(__file__))


class ProcessStep:
    def __init__(self) -> None:
        self._data = {}

    def generate(self, step_name: str):
        self._data['_id'] = helpers.name_to_id(step_name)
        self._data['options'] = {
            "cancel": {
                "label": "Cancel",
                "actions": ""
            },
            "save": {
                "label": "Save",
                "actions": ""
            }
        }
        self._data['next_steps'] = {
            "steps": [],
            "requirements": ""
        }
        self._data["row"] = 0
        self._data["column"] = 0
        self._data["event_type"] = "read"
        self._data["edge_status"] = "00_NOT_EDGE"

        self._data["fields"] = {}

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
        _id = helpers.name_to_id(data['name'])

        self._data = {
            '_id': _id,
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
            result = self.collection.insert_one(self._data)

            if result.acknowledged:
                for step in parsed_steps:
                    for script_type in ['requirements', 'actions']:
                        output_folder = os.path.join(CURRENT_DIRECTORY, f"scripts/src/{_id}")
                        helpers.generate_scripts_folder(destination_folder=output_folder, file_name=f'{script_type}_{step}', file_content="")

    def get_all_ids(self):
        ids = self.collection.find({}, {'_id': 1})
        ids_list = [str(doc['_id']) for doc in ids]

        return ids_list

    def get_process(self, processId):
        prcs = self.collection.find({'_id': processId})
        prcs = json_util.loads(json_util.dumps(prcs))[0]
        self._data = prcs
        _id = self._data['_id']

        # transfer script code to transition and action fields
        input_folder = os.path.join(CURRENT_DIRECTORY, f"scripts/src/{_id}")
        for step in self._data['steps']:
            requirement_script_content = helpers.read_py_files(destination_folder=input_folder, file_name=f'requirements_{step}')
            self._data['steps'][step]['next_steps']['requirements'] = requirement_script_content

            save_action_script_content = helpers.read_py_files(destination_folder=input_folder, file_name=f'actions_{step}')
            self._data['steps'][step]['options']['save']['actions'] = save_action_script_content

        return self._data

    def put_process(self, id, **data):
        # data comes as a value of a dict with key of 'data'
        self._data = data['data']
        _id = self._data['_id']

        # transfer script code to scripts/src
        output_folder = os.path.join(CURRENT_DIRECTORY, f"scripts/src/{_id}")
        for step in self._data['steps']:
            requirement_script_content = self._data['steps'][step]['next_steps']['requirements']
            helpers.generate_scripts_folder(destination_folder=output_folder, file_name=f'requirements_{step}', file_content=requirement_script_content)
            # clean out code, do not save in db
            self._data['steps'][step]['next_steps']['requirements'] = ""

            save_action_script_content = self._data['steps'][step]['options']['save']['actions']
            helpers.generate_scripts_folder(destination_folder=output_folder, file_name=f'actions_{step}', file_content=save_action_script_content)
            # clean out code, do not save in db
            self._data['steps'][step]['options']['save']['actions'] = ""


        if self.is_valid():
            self.update_process_design_status()

            # TODO find a better way to updaete new and existing updated fields only
            result = self.collection.update_one({"_id": id}, {"$set": self._data})
            return result
        
    def update_process_design_status(self):
        # check if all steps are connected, but without all requirement added
        all_steps = [k for k, _ in self._data['steps'].items()]
        connected_steps = []

        for step in all_steps:
            next_steps = self._data['steps'][step]['next_steps']['steps']
            if len(next_steps) != 0:
                connected_steps.append(step)
                connected_steps += next_steps

    def validate_and_publish_process(self, process_id, **data):
        # if not unwrapped, data will be passed with a second 'data' wrap while put_process expents and unwraps only one 'data' wrap
        self.put_process(id=process_id, data=data['data'])  
        # needed to get decoded values because they will be encoded later on put in this same function
        self.get_process(processId=process_id) 

        all_steps = [k for k, _ in self._data['steps'].items()]
        all_steps_progress_count ={step: {'goes_to': 0, 'comes_from': 0} for step in all_steps}
        
        # determine edges
        for step in all_steps:
            next_steps = self._data['steps'][step]['next_steps']['steps']
            all_steps_progress_count[step]['goes_to'] = len(next_steps)
            for n_step in next_steps:
                all_steps_progress_count[n_step]['comes_from'] += 1

        for step in all_steps:
            if all_steps_progress_count[step]['goes_to'] == 0:
                self._data['steps'][step]['edge_status'] = "02_END"
            if all_steps_progress_count[step]['comes_from'] == 0:
                self._data['steps'][step]['edge_status'] = "01_START"

        # udpate process status
        if self.is_valid():
            self._data['design_status'].append('VALIDATED_AND_PUBLISHED')
            result = self.put_process(id=process_id, data=self._data)
            
            if result.acknowledged:
                # create the first entry of the process instance to provide easy access to fields for later operations
                first_entry = self.generate_process_instance_frame(self._data['_id'])
                first_entry['operations_status'] = '03_TEMPLATE' # to avoid templates in front end adn analytics
                first_entry['_id'] = f'TEMPLATE---{str(uuid.uuid4())}'
                self.db.process_instance.insert_one(first_entry)

    def generate_process_instance_frame(self, process_type_id):
        self.get_process(processId=process_type_id)

        if self.is_valid():
            instance_frame = {
                '_id':'',
                'process_type': self._data['_id'],
                'organization': self._data['organization'],
                'operations_status': '00_PROCESS_CREATED',
                'document_instances': {
                    k: DocumentType().generate_document_instance_frame(k) for k in self._data['documents']
                },
                'steps': self._data['steps']
            }

            return instance_frame
        
    def is_valid(self):
        # TODO add validation
        return True
 