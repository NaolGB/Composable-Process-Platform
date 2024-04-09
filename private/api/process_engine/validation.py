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

    for k, v in document['master_data_type'].items():
        validation_passed *= "fields_to_update" in v
        validation_passed *= "fields_to_display" in v

    for k, v in document['functions'].items():
        validation_passed *= type(v) == dict

    return validation_passed