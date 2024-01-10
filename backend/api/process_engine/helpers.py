class PEValidationError(Exception):
    def __init__(self, messege="Process Engine validation failed") -> None:
        self.message = messege
        super().__init__(self.message)

class PEAttributeNotFoundError(Exception):
    def __init__(self, messege="Process Engine can not find all required attributes") -> None:
        self.message = messege
        super().__init__(self.message)

class PETooManyAttributesError(Exception):
    def __init__(self, messege="Process Engine found morethan allowed attributes") -> None:
        self.message = messege
        super().__init__(self.message)

def name_to_id(name: str):
    """given a string it converts is to stripped string without spaces"""
    new_name = name.strip()
    new_name = new_name.replace(' ', '_')
    return new_name