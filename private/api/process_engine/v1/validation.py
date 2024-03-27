def validate_master_data_type(document):
    validation_passed =  "display_name" in document and "attributes" in document

    for k, v in document.items():
        validation_passed *= type(v) == dict
        validation_passed *= "display_name" in v
        validation_passed *= "type" in v
        validation_passed *= "required" in v
        validation_passed *= "default_value" in v

    return validation_passed
