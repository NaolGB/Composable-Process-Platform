import uuid
import helpers

class ObjectAttribute:
    """
    an object attribute is what can be considered as a column of an object
    """
    def __init__(self, att_name: str, att_dtype: str, att_required: bool = False) -> None:
        self.att_name = att_name
        self.att_required = att_required
        self.att_dtype = att_dtype

class ProcessObjectType:
    """
    an object is a participant in a process 
        ex: customer, employee, material
    a process object type is a definition of an object, it does not have id
    it has a unique name that identifies it within the entire process flow
    """
    def __init__(self, o_name: str, o_attributes: [ObjectAttribute]) -> None:
        self.o_name = o_name
        self.o_attributes = o_attributes
        
class ProcessObjectInstance:
    """
    a process object instance is an object which has a type and populated data
    it has a unique id that identifies it within the entire process flow
    """
    def __init__(self, o_type: ProcessObjectType, attributes: dict) -> None:
        self.o_id = uuid.uuid4()
        self.o_type = o_type
        self.att = attributes

        self.assign_atributes()

    def assign_atributes(self):
        """
        all required attributes must be accounted for
        there can be non-required attributes
        """
        # check required attributes are provided
        o_type_req_att = [att.att_name for att in self.o_type.o_attributes if att.att_required==True]
        missing_req_att = [k for k in o_type_req_att if k not in self.att.keys()]
        if missing_req_att:
            raise helpers.PORequiredAttributeNotFound(f"Missing required attributes: {missing_req_att}")

        # TODO validate atribute types