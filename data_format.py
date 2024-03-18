# master_data_type
received_from_client_example_master_data_type_uuid123 = {
    "display_name": 'Materials',
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Name'},
        'quantity': {"display_name": 'Quantity', "type": 'number', "required": False, "default_value": 0.00},
        'plant': {"display_name": 'Plant', "type": 'master_data', "required": True, "default_value": 'Plant'}
    }
}

saved_example_master_data_type_uuid123 = {
    "display_name": 'Materials',
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Name'},
        'quantity': {"display_name": 'Quantity', "type": 'number', "required": False, "default_value": 0.00},
        'plant': {"display_name": 'Plant', "type": 'master_data', "required": True, "default_value": 'Plant'}
    }
}

# master_data_instance
example_master_data_instance_uuid456 = {
    "master_data_type": 'example_master_data_type_uuid123',
    "content": {
        {'name': 'MacBook Air 2020'},
        {'quantity': 234},
        {'plant': 'plant_uuid_1112'},
    }
}

api_status_message = {
    "success": bool, 
    "message":str,
    "data": dict if success else None
}