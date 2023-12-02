import uuid
from datetime import datetime
import helpers
import process_object as PO

class ProcessActivityType:
    """
    a process activity type holds required information for the activity but is not the performance of the activity
    It holds the definition for the operations but does not execute them
    Activities connect to each other to make up the PEProcess. Since Activities own objects and owners, they serve as the source of information for connections
    """
    def __init__(self, operation,  a_name: str, a_object: PO.ProcessObjectType, a_owner: PO.ProcessObjectType, a_from: 'ProcessActivityType') -> None:
        self.a_name = a_name
        self.a_owner = a_owner
        self.a_object = a_object
        self.a_operation = operation

        self.a_from = a_from
        self.a_to = None
        # TODO place control against a_from and a_to for start and stop
        
class ProcessActivityInstance:
    """
    a process activity instance takes the required information from a process activity type and performs the activity
    It includes assigning values to paramentes of operations in process activity type and executing them
    """
    def  __init__(self, a_type: ProcessActivityType) -> None:
        self.a_id = uuid.uuid4()
        self.a_timestamp = None
        self.a_type = a_type

    def action(self, **kwargs):
        self.a_type.a_operation(**kwargs)
        self.a_timestamp = datetime.now()   
        
        self.a_type.a_to
        
        # TODO validate a_to is valid
        
# class ProcessUnit:
#     """
#     process unit is an atomic connection unit holding an activity, its object, the previous process unit and the following process unit
#     """

class PEProcess:
    """
    a process is a combination of process units that makes up an entire process
    It begins with a StartProcessUnit and ends with StopProcessUnit
    It is a way to organize a process and a source to build a back end from
    """
    def __init__(self, ) -> None:
        pass

    # TODO perform uniqueness checks for object names within a process flow 
    # (for cases when there needs to be a loop, we can reffer to the object by name)
        # process type names