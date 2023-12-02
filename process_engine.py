import uuid
from datetime import datetime
import helpers
import process_object as PO

class ProcessActivityInstance:
    """
    a process activity instance is an instance of the process activity type
    it has its own id and timestamp
    """
    def __init__(self, operation,  a_name: str, a_object: PO.ProcessObjectType, a_owner: PO.ProcessObjectType) -> None:
        self.a_id = uuid.uuid4()
        self.a_name = a_name
        self.a_owner = a_owner
        self.a_object = a_object
        self.a_timestamp = None
        self.operation = operation

    def action(self) -> uuid.UUID:
        self.operation()

# FIXME solve the logic: do we need activity type?
class ProcessUnit:
    """
    a process unit is an atomic combination of an activity and objects that comes from anther process unit and goes to another process unit
    """
    def __init__(self, pu_objects: [PO.ProcessObjectType], pu_activity: ProcessActivityInstance, pu_comes_from: 'ProcessUnit') -> None:
        self.pu_id = uuid.uuid4()
        self.pu_objects = pu_objects
        self.pu_activity = pu_activity
        self.pu_comes_from = pu_comes_from
        self.pu_goes_to = None
        
        self.next_pu_id = self.pu_activity.action()
        self.pu_activity.a_timestamp = datetime.now()

    def what_is_next(self):
        pass

class StartProcessUnit:
    """
    a special process unit that is used at the start of a process. Should be used, at leas and at most, once in a process
    """
    def __init__(self) -> None:
        self.pu_id = uuid.UUID('1dfd9652-00e1-483a-9138-33f9baf4bda6')

class StopProcessUnit:
    """
    a special process unit that is used at the end of a process. Should be used, at leas and at most, once in a process
    """
    def __init__(self) -> None:
        self.pu_id = uuid.UUID('195b6e75-f3c5-450d-9389-af19d4d1ba71')
        # TODO change start and stop process units to operate with names so that there can be different instancess 
        # in different process flow instances

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