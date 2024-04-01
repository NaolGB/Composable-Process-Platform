def validate_master_data_type(document):
    validation_passed = type(document) == dict
    validation_passed *=  "display_name" in document and "attributes" in document

    for k, v in document['attributes'].items():
        validation_passed *= "display_name" in v
        validation_passed *= "type" in v
        validation_passed *= "is_required" in v
        validation_passed *= "default_value" in v


    return validation_passed
