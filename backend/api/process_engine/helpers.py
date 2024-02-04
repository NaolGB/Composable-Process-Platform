import base64

class PEPlaceholderError(Exception):
    def __init__(self, messege="This is a palceholder error") -> None:
        self.message = messege
        super().__init__(self.message)

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

def get_b64_text(plain_text):
    encoded_bytes = base64.b64encode(plain_text.encode('utf-8'))
    b64_text = encoded_bytes.decode('utf-8')
    
    return b64_text

def get_plain_text(b64_text):
    decoded_bytes = base64.b64decode(b64_text)
    plain_text = decoded_bytes.decode('utf-8')

    return plain_text

def separate_characters(text):
    modified_str = ""

    for i, char in enumerate(text[::-1]):
        if i > 0 and i % 3 == 0:
            modified_str += '_'
        modified_str += char

    modified_str = modified_str[::-1]

    return modified_str