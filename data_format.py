# master_data -----------------------------------------------------
received_from_client_example_master_data_type_uuid123 = { # _id: 'example_master_data_type_uuid123'
    "display_name": 'Materials',
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Name'},
        'quantity': {"display_name": 'Quantity', "type": 'number', "required": False, "default_value": 0.00},
        'plant': {"display_name": 'Plant', "type": 'master_data', "required": True, "default_value": 'Plant'}
    }
}


example_master_data_instance_uuid456 = { # _id: 'master_data_instance_uuid456'
    "master_data_type": 'example_master_data_type_uuid123',
    "content": {
        {'name': 'MacBook Air 2020'},
        {'quantity': 234},
        {'plant': 'plant_uuid_1112'},
    }
}
# master_data -----------------------------------------------------

# document --------------------------------------------------------
received_from_client_example_document_type_uuid123 = { # _id: 'example_document_type_uuid123'
    "display_name": 'Sales Order',
    "master_data_type": ['example_master_data_type_uuid123'],
    "intelligence_hub_scripts": {
        "extract_free_text": {
            "display_name": 'Extract Free Text',
            "type": "action", # action, information
            "script_id": 'extract_free_text_script_id123',
            "input_fields": {
                'text': {"display_name": 'Text', "type": 'string', "required": True},
            },
        },
        "suggest_plant": {
            "display_name": 'Suggest Plant',
            "type": "information", # action, information
            "script_id": 'suggest_plant_script_id123',
            "input_fields": {},
        },
    },
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Sales Order'},
        'billing_block': {"display_name": 'Billing Block', "type": 'boolean', "required": True, "default_value": False},
        'example_master_data_type_uuid123': []
    }
}

example_document_instance_uuid456 = { # _id: 'document_instance_uuid456'
    "document_type": 'example_document_type_uuid123',
    "content": {
        'name': 'Sales Order 123',
        'billing_block': False,
        'example_master_data_type_uuid123': [
            {'name': 'MacBook Air 2020', 'quantity': 234},
            {'name': 'iPhone 12', 'quantity': 100},
        ]
    }
}
# document --------------------------------------------------------

# process ---------------------------------------------------------
process_type_uuid123 = { # _id: 'example_process_type_uuid123'
    "display_name": 'Sales Order Process',
    "documents": ['example_document_type_uuid123'],
}
process_instance_uuid789 = { # _id: 'process_instance_uuid789'
    "process_type": 'example_process_type_uuid123',
    "case_id": 'example_case_id789',
    "status": 'in_progress', # in_progress, completed, failed
    "documents": [
        'example_document_type_uuid123'
    ]
}
# process ---------------------------------------------------------