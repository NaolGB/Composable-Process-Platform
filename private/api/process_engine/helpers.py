import re

def generate_id_from_display_name(display_name):
        # Convert display_name to a suitable format for _id
        return re.sub(r'\s+', '_', display_name).lower()

