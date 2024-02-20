import os
import uuid 
import json
from datetime import datetime
import ast
import docker
from bson import json_util
from . import helpers, db_secrets
from .process_instance import ProcessInstance
from .process_type import ProcessType
from .data_api import DocumentApi, DocumentMasterDataApi, MasterDataApi

# TODO manage methods to create client better - maybe one client instance per org
client = db_secrets.get_client()
CURRENT_DIRECTORY = os.path.abspath(os.path.dirname(__file__))

class ProcessEvent:
    def __init__(self, user_name) -> None:
        self.user_name = user_name
        self.db = client['dev']
        self._collection = self.db.events
        pass

    def get_data_details(self, dtype, id):
        """
        returns all entries in the db taht match the given criteria along with supporting metadata
        In the case of GET the argument parameters reffer to
            1. dtype: master_instance | process_instance
            2. id: 
                - master data type (to get the collection of that master data) 
                - process type (to get the `process_type` field in the process_instance collection)
        """
        if dtype == 'master_instance':
            # DEBUG ----------------
            # print(DocumentMasterDataApi(process_type='pr14', process_instance_id='pr14_00_000_011', document_id='SO_Doc_-_3').get_document_master_data_dict())
            # DEBUG ----------------
            temp_collection = self.db[f'{id}']

            result = temp_collection.find({}) 
            result = json_util.loads(json_util.dumps(result, default=str))

            # fields with TEMPLATE--- id are empty fields that are generate to 'instantiate' the collection or type
            columns = temp_collection.find({'_id': {"$regex": "^TEMPLATE---"}})
            columns = json_util.loads(json_util.dumps(columns, default=str))

            temp_collection = None
            
            metadata = {
                "columns": helpers.extract_unqiue_columns(columns)
            }
            
            return {"data": result, "metadata": metadata}
        elif dtype == 'process_instance':
            # DEBUG ----------------
            # print(MasterDataApi(master_data_type='material', master_data_id='Mac_Book_Air').get_master_data_dict())
            # DEBUG ----------------
            temp_collection = self.db.process_instance

            result = temp_collection.find({'process_type': id}) 
            result = json_util.loads(json_util.dumps(result, default=str))

            # fields with TEMPLATE--- id are empty fields that are generate to 'instantiate' the collection or type
            columns = temp_collection.find({'process_type': id, '_id': {"$regex": "^TEMPLATE---"}})
            columns = json_util.loads(json_util.dumps(columns, default=str))

            temp_collection = None

            metadata = {
                "columns": helpers.extract_unqiue_columns(columns)
            }

            return {"data": result, "metadata": metadata}

        else:
            raise helpers.PEPlaceholderError()
        
    def post_data_detail(self, dtype, id, data):
        """
        POSTs data in `data` argument into the corresponding collection
        In the case of POST the argument parameters reffer to
            1. dtype: master_instance | process_instance
            2. id: 
                - master data type (to get the collection of that master data) 
                - process type (to get the `process_type` field in the process_instance collection)
            3. data: the data to post (comes with fields passed through the GET)
        """
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
        elif dtype == 'process_instance':
            temp_collection = self.db.process_instance
       
            # assign id to new process instance
            data = ProcessType().generate_process_instance_frame(process_type_id=id)
            prcs_count = temp_collection.count_documents({'process_type': id})
            prcs_id = (8 - len(str(prcs_count))) * '0' + str(prcs_count)
            data['_id'] = f'{str(id)}_{helpers.separate_characters(prcs_id)}'

            temp_collection.insert_one(data)
            temp_collection = None

            event_actions = {
                "user_name": self.user_name,
                "timestamp": datetime.utcnow(),
                "status": "OK"
            }
            self.record_event(
                event_name=f'create process instance', 
                event_type='create', 
                data_type='process_instance', 
                data_id=id,
                actions=event_actions
            )
        else:
            raise helpers.PEPlaceholderError()
        
    def put_event_detail(self, dtype, id, data):
        """
        applies effects / updated fields from process step after clicking `Save`
        PUTs data in `data` argument into the corresponding collection
        In the case of PUT the argument parameters reffer to
            1. dtype: master_instance | process_instance
            2. id: 
                - master data type (to get the collection of that master data) 
                - process type (to get the `process_type` field in the process_instance collection)
                    * the id of the process intance is passed within the `data` argument
            3. data: the data to update (comes with fields passed through the GET)
        """
        if dtype == 'master_instance':
            raise helpers.PEPlaceholderError('PUT for master_instance not implemented')
        elif dtype == 'process_instance':
            # set docker enviroment variables
            docker_env_variables = {
                'DATABASE_URL': 'mysql://user:password@hostname/database',
                'OTHER_VARIABLE': 'value'
            }
            # apply manual actions: already applied on `data`
            # apply automated action effects: execute actions -> PATCH process
            docker_client = docker.from_env()
            script_final_path = os.path.join(CURRENT_DIRECTORY, f"scripts/src/{data['process_type']}/")
            volumes = {script_final_path: {'bind': '/app', 'mode': 'rw'}}
            command = f"python actions_{data['operations_status']}.py"
            docker_container = docker_client.containers.run('scripts', command=command, volumes=volumes, environment=docker_env_variables, detach=True, stdout=True)
            docker_container_output = helpers.listen_to_docker_container_output(docker_container)
            
            
            for output in docker_container_output:
                output = ast.literal_eval(output) # json.loads requires  double quoted key values but ast.literal_evel takes evalyuates the str(dict) as dict
                
                if output['metadata']['type'] == 'document_wrapper':
                    for k, v in output['data'].items():
                        document_id = output['document_id']
                        self.db.process_instance.update_one({'_id': output['process_instance_id']}, {
                            '$set': {f'document_instances.{document_id}.{k}': v}
                        })
                elif output['metadata']['type'] == 'document_master_data_wrapper':
                    for k, v in output['data'].items():
                        document_id = output['document_id']
                        lead_object_key = f"{output['lead_object']}s"
                        master_data_id = output['master_data_id']
                        self.db.process_instance.update_one({'_id': output['process_instance_id']}, {
                            '$set': {f'document_instances.{document_id}.{lead_object_key}.{k}': v}
                        })
                elif output['metadata']['type'] == 'master_data_wrapper':
                    for k, v in output['data'].items():
                        master_data_id = output['metadata']['master_data_id']
                        master_data_type = output['metadata']['master_data_type']
                        temp_collection = self.db[f'{master_data_type}']
                        temp_collection.update_one({'_id': master_data_id}, {
                            '$set': {k: v}
                        })
                else:
                    raise helpers.PEPlaceholderError('Unknown wrapper type')

            # determine next steps: execute transitions -> PATCH process
            docker_client = docker.from_env()
            script_final_path = os.path.join(CURRENT_DIRECTORY, f"scripts/src/{data['process_type']}/")
            volumes = {script_final_path: {'bind': '/app', 'mode': 'rw'}}
            command = f"python requirements_{data['operations_status']}.py"
            docker_container = docker_client.containers.run('scripts', command=command, volumes=volumes, environment=docker_env_variables, detach=True, stdout=True)
            docker_container_output = helpers.listen_to_docker_container_output(docker_container)
            
            if len(docker_container_output) > 1:
                # print(docker_container_output)
                raise helpers.PEPlaceholderError('Morethan 1 next step returned')
            else:
                data['operations_status'] = docker_container_output[0]

            # update operation_status if the process has ended
            if data['steps'][data['operations_status']]['edge_status'] == '02_END':
                data['operations_status'] = '02_END'
            
            # update process intance with all changes
            temp_collection = self.db.process_instance
            result = temp_collection.update_one({'_id': data['_id']}, {'$set': data})
            temp_collection = None

            if result.acknowledged != True: 
                raise helpers.PEPlaceholderError('PUT for master_instance not implemented')
            
            event_actions = {
                "user_name": self.user_name,
                "timestamp": datetime.utcnow(),
                "status": "OK"
            }
            self.record_event(
                event_name=f'update process instance', 
                event_type='update', 
                data_type='process_instance', 
                data_id=id,
                actions=event_actions
            )
                

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