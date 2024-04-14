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

# execution_script ------------------------------------------------
execution_script_example_script_uuid123 = { # _id: 'example_script_uuid123'
    "display_name": 'Parse Free Text',
    "file_path": '/execution_script_parse_free_text.py',
    "inut_parameters": {
        'text': [{"display_name": 'Text', "type": 'string', "required": True}],
    },
    "output_parameters": {
        'parsed_text': [{"display_name": 'Parsed Text', "type": 'string'}],
    },

}
# execution_script ------------------------------------------------

# document --------------------------------------------------------
received_from_client_example_document_type_uuid123 = { # _id: 'example_document_type_uuid123'
    "display_name": 'Sales Order',
    "master_data_type": { # NOTE: only one master data type per document type - master data has ability to reference other master data by itself
        'id': 'master_data_type_uuid123',
        'fields_to_update': ['quantity'], 
        'fields_to_display': ['name', 'quantity']
    },
    "attributes": {
        'name': {"display_name": 'Name', "type": 'string', "required": True, "default_value": 'Sales Order'},
        'billing_block': {"display_name": 'Billing Block', "type": 'boolean', "required": True, "default_value": False},
        'free_text': {"display_name": 'Free Text', "type": 'string', "required": False, "default_value": ''},
        'example_master_data_type_uuid123': []
    },
    "functions": {
        'example_script_uuid123': {
            'inputs': {
                'free_text': {
                    'source': 'document',
                    'field': 'free_text',
                },
                'quantities': {
                    'source': 'master_data',
                    'field': 'quantity',
                }
            },
            'outputs': {
                'parsed_text': {
                    'destination': 'document',
                    'field': 'free_text',
                }
            },
        }
    }
}

example_document_instance_uuid456 = { # _id: 'document_instance_uuid456'
    "document_type": 'example_document_type_uuid123',
    "attributes": {
        'name': 'Sales Order 123',
        'billing_block': False,
        'free_text': '234 macbook air 2020, 100 iphone 12',
        'example_master_data_type_uuid123': [
            {'name': 'MacBook Air 2020', 'quantity': 234},
            {'name': 'iPhone 12', 'quantity': 100},
        ]
    },
    "master_data_references": {
        'example_master_data_type_uuid123': {
            'fields_to_update': ['quantity'],
            'fields_to_display': ['name', 'quantity'],
            'content': {
                'example_master_data_instance_uuid456': {'name': 'MacBook Air 2020', 'quantity': 234},
                'example_master_data_instance_uuid789': {'name': 'iPhone 12', 'quantity': 100},
            }
        }
    }
}
# document --------------------------------------------------------

# event -----------------------------------------------------------
event_instance_uuid123 = { # _id: 'event_instance_uuid123v'
    "display_name": 'Sales Order Created',
    "document_type": 'example_document_type_uuid123',
    "execution_script": 'example_script_uuid123',
    "process_type": 'example_process_type_uuid1234',
    "started_by": 'user_uuid123',
    "responder_users": ['user_uuid123'],
    "started_at": '2021-01-01T00:00:00Z',
    "completed_at": '2021-01-01T00:00:00Z',
    "status": 'completed', # completed, in_progress, failed
    "updated_document_instance": {
        'document_instance_uuid456': {
            "field": "billing_block",
            "old_value": False,
            "new_value": True,
        }
    },
    "updated_master_data_instance":{
        'master_data_instance_uuid456': {
            "field": "quantity",
            "old_value": 234,
            "new_value": 100,
        }
    }
}
# event -----------------------------------------------------------

# process_type ----------------------------------------------------
om_steps = ['Create Sales Order', 'Check Credit Limit', 'Set Credit Block', 'Remove Credit Block (Automated)', 'Remove Credit Block (Manual)', 'Create Delivery', 'Create Invoice', 'End']
process_type_uuid1234 = { # _id: 'example_process_type_uuid1234'
    "display_name": 'Sales Order Process',
    "documents": ['example_document_type_uuid123'],
    "steps": {
        'create_sales_order': {
            "display_name": 'Create Sales Order',
            "type": 'start',
            "next_step": {
                "has_multiple_next_steps": False,
                "next_step": 'check_credit_limit'
            }
        }, 
        'check_credit_limit': {
            "display_name": 'Check Credit Limit',
            "type": 'automated',
            "action": {
                "document_type": 'example_document_type_uuid123',
                "execution_script": 'example_script_uuid123',
            },
            "next_step": {
                "has_multiple_next_steps": True,
                "conditional_value": 'example_document_instance_uuid456.billing_block',
                "conditions": {
                    "condition_1": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '01', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '01' or billing_block == '02' and billing_block != '00' then next step is set_credit_block
                            '02': {'operator': '==', 'value': '02', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '00', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "set_credit_block"
                    },
                    "condition_2": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '00', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '00' or billing_block == '01' and billing_block != '02' then next step is remove_credit_block_manual
                            '02': {'operator': '==', 'value': '01', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '02', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "remove_credit_block_manual"
                    },                    
                }
            } 
        },
        'set_credit_block': {
            "display_name": 'Set Credit Block',
            "type": 'automated',
            "action": {
                "document_type": 'example_document_type_uuid123',
                "execution_script": 'example_script_uuid123',
            },
            "next_step":{
                "has_multiple_next_steps": True,
                "conditional_value": 'example_document_instance_uuid456.billing_block',
                "conditions": {
                    "condition_1": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '01', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '01' or billing_block == '02' and billing_block != '00' then next step is set_credit_block
                            '02': {'operator': '==', 'value': '02', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '00', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "set_credit_block"
                    },
                    "condition_2": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '00', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '00' or billing_block == '01' and billing_block != '02' then next step is remove_credit_block_manual
                            '02': {'operator': '==', 'value': '01', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '02', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "remove_credit_block_manual"
                    },                    
                }
            }
        },
        'remove_credit_block_manual': {
            "display_name": 'Remove Credit Block (Manual)',
            "type": 'manual', # we do not encode responder_users in the process type, but in the process instance
            "manual_options": {
                'sustain_credit_block': {
                    "display_name": 'Sustain Credit Block',
                    'action': {
                        "document_type": 'example_document_type_uuid123',
                        "execution_script": 'example_script_uuid123', # changes the billing_block attribute to True
                    },
                },
                'remove_credit_block': {
                    "display_name": 'Remove Credit Block',
                    'action': {
                        "document_type": 'example_document_type_uuid123',
                        "execution_script": 'example_script_uuid123', # changes the billing_block attribute to False
                    },
                },
            },
            "next_step": {
                "has_multiple_next_steps": True,
                "conditional_value": 'example_document_instance_uuid456.billing_block',
                "conditions": {
                    "condition_1": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '01', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '01' or billing_block == '02' and billing_block != '00' then next step is set_credit_block
                            '02': {'operator': '==', 'value': '02', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '00', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "set_credit_block"
                    },
                    "condition_2": {
                        "comparison": {
                            '01': {'operator': '==', 'value': '00', 'logic': 'or', 'next_comparison': '02'}, # billing_block == '00' or billing_block == '01' and billing_block != '02' then next step is remove_credit_block_manual
                            '02': {'operator': '==', 'value': '01', 'logic': 'and', 'next_comparison': '03'},
                            '03': {'operator': '!=', 'value': '02', 'logic': 'and', 'next_comparison': None},
                        },
                        "next_step": "remove_credit_block_manual"
                    },                    
                }
            }
        },
        'remove_credit_block_automated': {
            "display_name": 'Remove Credit Block (Automated)',
            "type": 'automated',
            "action": {
                "document_type": 'example_document_type_uuid123',
                "execution_script": 'example_script_uuid123', # changes the billing_block attribute to False
            },
            "next_step": {
                "has_multiple_next_steps": False,
                "next_step": 'create_delivery'
            }
        },
        'create_delivery': {
            "display_name": 'Create Delivery',
            "type": 'automated',
            "action": {
                "document_type": 'example_document_type_uuid123',
                "execution_script": 'example_script_uuid123', # creates a delivery document
            },
            "next_step": {
                "has_multiple_next_steps": False,
                "next_step": 'create_invoice'
            }
        },
        'create_invoice': {
            "display_name": 'Create Invoice',
            "type": 'automated',
            "action": {
                "document_type": 'example_document_type_uuid123',
                "execution_script": 'example_script_uuid123', # creates an invoice document
            },
            "next_step": {
                "has_multiple_next_steps": False,
                "next_step": 'end'
            }
        },
        'end': {
            "display_name": 'End',
            "type": 'end',
        },
    }
}
# process_type ----------------------------------------------------

# process_instance ------------------------------------------------
example_process_instance_uuid123 = { # _id: 'example_process_instance_uuid123'
    "process_type": 'example_process_type_uuid1234',
    "document_instances": ['example_document_instance_uuid456'],
    "current_step": 'check_credit_limit',
    "responder_users": ['user_uuid123'],
    "status": 'in_progress', # in_progress, completed, failed
    "events": ['event_instance_uuid123'],
}
# process_instance ------------------------------------------------

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
    "role": 'admin', # admin, analyst, business_user
    "processes": ['example_process_type_uuid123'],
    "organization": 'apple',
    "status": 'active', # active, inactive
}
# user ------------------------------------------------------------