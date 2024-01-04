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