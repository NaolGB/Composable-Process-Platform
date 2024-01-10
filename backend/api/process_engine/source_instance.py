import uuid
from . import helpers

class SourceInstance:
    def __init__(self) -> None:
        # self._id = None
        self._organization = None
        self._collection = None
        self._attributes = None

    def create_from_master_dtype(self, mdtype_dict: dict):
        if mdtype_dict['attributes'].get('name') != None:
            self._collection = helpers.name_to_id(mdtype_dict['attributes']['name'])
        else:
            self._collection = str(uuid.uuid4())

        # take care of name attribute
        # for att in mdtype_dict['attributes']: