import uuid

class ObjectAttribute:
    """
    an object attribute is what can be considered as a column of an object
    """
    def __init__(self, att_name: str, att_required: bool) -> None:
        self.att_name = att_name
        self.att_required = att_required

class ProcessObject:
    """
    an object is a participant in a process 
        ex: customer, employee, material
    """
    def __init__(self, o_name: str, o_attributes: list(ObjectAttribute)) -> None:
        self.o_name = o_name
        self.o_attributes = o_attributes
        # self.o_type = o_type # object type ex: Material x, Consultant, 

class ActivityEffect:
    """
    an effect of an activity is what determines next step's objects
        ex: an effect  of 'Assign' creates new decument like delivery for sales order
            an effect of 'Send' send confirmations/invoices to the customer
    """
    def __init__(self, a_eff_name: str, a_eff_function: str) -> None:
        self.a_eff_name = a_eff_name
        self.a_eff_function = a_eff_function # TODO work out a logic to add functionality of effects on given objects via activities

class ProcessActivity:
    """
    an activity is an action an owner of the action is taking on an object
    activity owner (a_owner) is an object that performs the activity - likely a User object (employee)
    """
    def __init__(self, a_name: str, a_effect: ActivityEffect, a_object: ProcessObject, a_owner: ProcessObject) -> None:
        self.a_name = a_name
        self.a_effect = a_effect
        self.a_object = a_object
        self.a_owner = a_owner

class ProcessUnit:
    """
    a process unit is an atomic combination of an activity and objects that comes from anther process unit and goes to another process unit
    """
    def __init__(self, pu_objects: list(ProcessObject), pu_activity: ProcessActivity, pu_comes_from: 'ProcessUnit', pu_goes_to: 'ProcessUnit') -> None:
        self.pu_id = uuid.uuid4()
        self.pu_objects = pu_objects
        self.pu_activity = pu_activity
        self.pu_comes_from = pu_comes_from
        self.pu_goes_to = pu_goes_to

class StartProcessUnit:
    """
    a special process uit that is used at the start of a process. Should be used, at leas and at most, once in a process
    """
    def __init__(self) -> None:
        self.pu_id = uuid.UUID('1dfd9652-00e1-483a-9138-33f9baf4bda6')

class StopProcessUnit:
    """
    a special process uit that is used at the end of a process. Should be used, at leas and at most, once in a process
    """
    def __init__(self) -> None:
        self.pu_id = uuid.UUID('195b6e75-f3c5-450d-9389-af19d4d1ba71')

class ProcessFlow:
    """
    a process flow is a combination of process units that makes up an entire process
    It begins with a StartProcessUnit and ends with StopProcessUnit
    It is a way to organize a process and a source to build a back end from
    """
    def __init__(self, ) -> None:
        pass

    # TODO perform uniqueness checks for object names within a process flow 
    # (for cases when there needs to be a loop, we can reffer to the object by name)