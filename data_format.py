# master_data -----------------------------------------------------
received_from_client_example_master_data_type_uuid123 = { # _id: 'example_master_data_type_uuid123'
    "display_name": 'Materials',
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Name'},
        'quantity': {"display_name": 'Quantity', "type": 'number', "required": False, "default_value": 0.00},
        'plant_v02': {"display_name": 'Plant', "type": 'master_data', "required": True, "default_value": 'Plant'},
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
    "master_data_type": {
        'master_data_type_uuid123': {'fields_to_update': ['quantity'], 'fields_to_display': ['name', 'quantity']},
    },
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Sales Order'},
        'billing_block': {"display_name": 'Billing Block', "type": 'boolean', "required": True, "default_value": False},
        'free_text': {"display_name": 'Free Text', "type": 'string', "required": False, "default_value": ''},
        'example_master_data_type_uuid123': []
    }
}

example_document_instance_uuid456 = { # _id: 'document_instance_uuid456'
    "document_type": 'example_document_type_uuid123',
    "content": {
        'name': 'Sales Order 123',
        'billing_block': False,
        'free_text': 'This is a sample sales order.',
        'example_master_data_type_uuid123': [
            {'name': 'MacBook Air 2020', 'quantity': 234},
            {'name': 'iPhone 12', 'quantity': 100},
        ]
    }
}
# document --------------------------------------------------------

# process ---------------------------------------------------------
"""
Documents 
    - documents either manipulate master data or send out HTTP requests

Process
    - hold process steps
    - many document types can be attached to one process (many <-> many)
        - only one document instance of a document type can be attached to one process
    - in each process step, event scritpts are called (executed)
    - process can be "start" by a user or event

Steps
    - there are 4 types of steps: start, automated, manual, end
        - start: start of the process (manual or automated, requires user input/event or another automated step or trigger event)
        - automated: automatic execution (requires no user input/event, executed by another automated step or trigger event)
        - manual: manual execution (requires user input/event)
        - end: end of the process (manual or automated, requires user input/event or another automated step or trigger event)
    - each step can have multiple next steps
        - next step determined by the execution result of the current step
"""
om_steps = ['Create Sales Order', 'Check Credit Limit', 'Set Credit Block', 'Remove Credit Block (Automated)', 'Remove Credit Block (Manual)', 'Create Delivery', 'Create Invoice', 'End']
event_check_credit_limit = {
    "display_name": 'Check Credit Limit',
    "next_steps": ['set_credit_block', 'create_delivery'],
    "file_path": '/event_check_credit_limit.py',
    "requires_manual_action": False,
}
event_remove_credit_block_manual = {
    "display_name": 'Remove Credit Block (Manual)',
    "next_steps": ['create_delivery', 'end'],
    "file_path": '/event_remove_credit_block_manual.py',
    "requires_manual_action": True,
    "manual_options": {
        'sustain_credit_block': {"display_name": 'Sustain Credit Block', "next_step": 'end'},
        'remove_credit_block': {"display_name": 'Remove Credit Block', "next_step": 'create_delivery'},
    },
    "responder_users": ['user_uuid123'],
    "status": 'pending',
}
process_type_uuid1234 = { # _id: 'example_process_type_uuid1234'
    "display_name": 'Sales Order Process',
    "documents": ['example_document_type_uuid123'],
    "steps": {
        'create_sales_order': {
            "display_name": 'Create Sales Order',
            "type": 'start',
            "next_steps": ['check_credit_limit']
        }, 
        'check_credit_limit': {
            "display_name": 'Check Credit Limit',
            "type": 'automated',
            "next_steps": ['set_credit_block', 'create_delivery']
        },
        'set_credit_block': {
            "display_name": 'Set Credit Block',
            "type": 'automated',
            "next_steps": ['remove_credit_block_manual', 'remove_credit_block_automated']
        },
        'remove_credit_block_manual': {
            "display_name": 'Remove Credit Block (Manual)',
            "type": 'manual', # we do not encode responder_users in the process type, but in the process instance
            "manual_options": {
                'sustain_credit_block': {"display_name": 'Sustain Credit Block', "next_step": 'end'},
                'remove_credit_block': {"display_name": 'Remove Credit Block', "next_step": 'create_delivery'},
            }
        },
        'remove_credit_block_automated': {
            "display_name": 'Remove Credit Block (Automated)',
            "type": 'automated',
            "next_steps": ['create_delivery']
        },
        'create_delivery': {
            "display_name": 'Create Delivery',
            "type": 'automated',
            "next_steps": ['create_invoice', 'end']
        },
        'create_invoice': {
            "display_name": 'Create Invoice',
            "type": 'automated',
            "next_steps": ['end']
        },
        'end': {
            "display_name": 'End',
            "type": 'end',
        },
    }
}
example_process_instance_uuid123 = { # _id: 'example_process_instance_uuid123'
    "process_type": 'example_process_type_uuid1234',
    "document_instances": ['example_document_instance_uuid456'],
    "steps": {
        'create_sales_order': {
            "status": 'completed',
            "result": 'success',
            "next_step": 'check_credit_limit'
        },
        'check_credit_limit': {
            "status": 'completed',
            "result": 'success',
            "next_step": 'set_credit_block'
        },
        'set_credit_block': {
            "status": 'completed',
            "result": 'success',
            "next_step": 'remove_credit_block_manual'
        },
        'remove_credit_block_manual': {
            "status": 'pending',
            "result": 'pending',
            "responder": 'user_uuid123',
            "selected_option": '',
            "next_step": 'create_delivery'
        },
        'create_delivery': {
            "status": 'pending',
            "result": 'pending',
            "next_step": 'create_invoice'
        },
        'create_invoice': {
            "status": 'pending',
            "result": 'pending',
            "next_step": 'end'
        },
        'end': {
            "status": 'pending',
            "result": 'pending',
        },
    }
}
# process ---------------------------------------------------------

# organization ----------------------------------------------------
apple = { # _id: 'apple'
    "display_name": 'Apple Inc.',
    "subdomain": 'apple',
    "version": '1.0.0',
    "databases": ['apple_db'],
    "status": 'active', # active, inactive
    "seat_count": {
        "capacity": {
            "admin": 1,
            "user": 10
        },
        "usage": {
            "admin": 1,
            "user": 1
        }
    },
    "execution_count": {
        'tier1': {
            'limit': 15_000,
            'usage': 7_596
        },
        'tier2': {
            'limit': 35_000,
            'usage': 0
        },
    }
}

# user ------------------------------------------------------------
user_uuid123 = { # _id: 'user_uuid123'
    "display_name": 'John Doe',
    "email": 'email@example.com',
    "role": 'admin',
    "processes": ['example_process_type_uuid123'],
    "organization": 'apple',
    "status": 'active', # active, inactive
}
# user ------------------------------------------------------------