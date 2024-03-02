class ProcessEngineResponse:
    def __init__(self, success: bool, message: str = "", data: dict = None):
        self.success = success
        self.message = message
        self.data = data
    
def name_to_id(name: str):
    """given a string it converts is to stripped string without spaces"""
    new_name = name.strip()
    new_name = new_name.replace(' ', '_')
    new_name = new_name.lower()
    return new_name
