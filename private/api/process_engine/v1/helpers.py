class ProcessEngineResponse:
    def __init__(self, success: bool, message: str = "", data: dict = None):
        self.success = success
        self.message = message
        self.data = data

class ProcessEngineValidator:
    def __init__(self) -> None:
        pass

    def data_has_attributes(self, data: dict, attributes: list):
        for attribute in attributes:
            if attribute not in data:
                return ProcessEngineResponse(success=False, message=f"Attribute '{attribute}' is required")
        return ProcessEngineResponse(success=True)
    
    def data_has_unique_attributes(self, data: dict):
        lowercase_keys = list(map(str.lower, data.keys()))
        if len(lowercase_keys) != len(list(set(lowercase_keys))):
            return ProcessEngineResponse(success=False, message="Attributes must be unique - case insensitive")
        return ProcessEngineResponse(success=True)

def name_to_id(name: str):
    """given a string it converts is to stripped string without spaces"""
    new_name = name.strip()
    new_name = new_name.replace(' ', '_')
    new_name = new_name.lower()
    return new_name
