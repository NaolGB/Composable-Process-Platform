import os
import shutil
import base64
import docker

CURRENT_DIRECTORY = os.path.abspath(os.path.dirname(__file__))

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

def extract_unqiue_columns(dict_list):
    """
    return a set of keys from the passed dict list
    """
    keys_set = list(set(key for d in dict_list for key in d.keys()))
    
    return keys_set

def generate_scripts_folder(destination_folder, file_name, file_content):
    full_file_path = os.path.join(destination_folder, f'{file_name}.py')
    data_api_source_path = CURRENT_DIRECTORY
    os.makedirs(destination_folder, exist_ok=True)
    with open(full_file_path, 'w') as file:
        file.write(file_content)
        file.close()
    
    # copy over data_api
    shutil.copy(f'{data_api_source_path}/data_api.py', destination_folder)

def read_py_files(destination_folder, file_name):
    full_file_path = os.path.join(destination_folder, f'{file_name}.py')
    try:
        with open(full_file_path, 'r') as file:
            content = file.read()
            file.close()
        return content
    except:
        return PEPlaceholderError('This is a placeholder error form helpers.read_py_files()')
    
def listen_to_docker_container_output(container):
    output = []
    for line in container.attach(stdout=True, stream=True, logs=True):
        for line_elem in line.strip().decode('utf-8').split('\n'):
            output.append(line_elem)

    return output
