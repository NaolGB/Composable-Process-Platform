def validate_master_data_type(document):
    validation_passed = type(document) == dict
    validation_passed *=  "display_name" in document and "attributes" in document

    for k, v in document['attributes'].items():
        validation_passed *= "display_name" in v
        validation_passed *= "type" in v
        validation_passed *= "is_required" in v
        validation_passed *= "default_value" in v


    return validation_passed

def validate_document_type(document):
    validation_passed = type(document) == dict
    validation_passed *=  ("display_name" in document) and ("attributes" in document) and \
                            ("master_data_type" in document) and ('functions' in document)

    for k, v in document['attributes'].items():
        validation_passed *= "display_name" in v
        validation_passed *= "type" in v
        validation_passed *= "is_required" in v
        validation_passed *= "default_value" in v
    print(1, validation_passed)

    validation_passed *= ("id" in document['master_data_type']) and ("fields_to_update" in document['master_data_type']) and ("fields_to_display" in document['master_data_type'])
    print(2, validation_passed)

    for k, v in document['functions'].items():
        validation_passed *= type(v) == dict
    print(3, validation_passed)
    return validation_passed

def validate_process_type(document):
    validation_passed = type(document) == dict
    validation_passed *=  ("display_name" in document) and ("documents" in document) and ("steps" in document)

    for k, v in document['steps'].items():
        validation_passed *= "display_name" in v
        validation_passed *= "type" in v
        validation_passed *= "manual_options" in v
        validation_passed *= "next_step" in v

    return validation_passed