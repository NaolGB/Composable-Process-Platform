const processFlow = {
    _id: 'example_process_type_uuid1234',
    display_name: 'Sales Order Process',
    documents: ['example_document_type_uuid123'],
    steps: {
      start: {
        display_name: 'Start',
        type: 'start',
        next_step: {
          has_multiple_next_steps: false,
          next_step: 'create_sales_order'
        }
      },
      create_sales_order: {
        display_name: 'Create Sales Order',
        type: 'manual',
        next_step: {
          has_multiple_next_steps: false,
          next_step: 'check_credit_limit'
        }
      },
      check_credit_limit: {
        display_name: 'Check Credit Limit',
        type: 'automated',
        action: {
          document_type: 'example_document_type_uuid123',
          execution_script: 'example_script_uuid123',
        },
        next_step: {
          conditional_value: 'example_document_instance_uuid456.billing_block',
          conditions: {
            condition_1: {
              comparison: {
                '01': { operator: '==', value: '01', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '02', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '00', logic: 'and', next_comparison: null },
              },
              next_step: 'set_credit_block'
            },
            condition_2: {
              comparison: {
                '01': { operator: '==', value: '00', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '01', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '02', logic: 'and', next_comparison: null },
              },
              next_step: 'create_delivery'
            },
          }
        }
      },
      set_credit_block: {
        display_name: 'Set Credit Block',
        type: 'automated',
        action: {
          document_type: 'example_document_type_uuid123',
          execution_script: 'example_script_uuid123',
        },
        next_step: {
          has_multiple_next_steps: true,
          conditional_value: 'example_document_instance_uuid456.billing_block',
          conditions: {
            condition_1: {
              comparison: {
                '01': { operator: '==', value: '01', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '02', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '00', logic: 'and', next_comparison: null },
              },
              next_step: 'remove_credit_block_automated'
            },
            condition_2: {
              comparison: {
                '01': { operator: '==', value: '00', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '01', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '02', logic: 'and', next_comparison: null },
              },
              next_step: 'remove_credit_block_manual'
            },
          }
        }
      },
      remove_credit_block_manual: {
        display_name: 'Remove Credit Block (Manual)',
        type: 'manual',
        manual_options: {
          sustain_credit_block: {
            display_name: 'Sustain Credit Block',
            action: {
              document_type: 'example_document_type_uuid123',
              execution_script: 'example_script_uuid123',
            },
          },
          remove_credit_block: {
            display_name: 'Remove Credit Block',
            action: {
              document_type: 'example_document_type_uuid123',
              execution_script: 'example_script_uuid123',
            },
          },
        },
        next_step: {
          has_multiple_next_steps: true,
          conditional_value: 'example_document_instance_uuid456.billing_block',
          conditions: {
            condition_1: {
              comparison: {
                '01': { operator: '==', value: '01', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '02', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '00', logic: 'and', next_comparison: null },
              },
              next_step: 'set_credit_block'
            },
            condition_2: {
              comparison: {
                '01': { operator: '==', value: '00', logic: 'or', next_comparison: '02' },
                '02': { operator: '==', value: '01', logic: 'and', next_comparison: '03' },
                '03': { operator: '!=', value: '02', logic: 'and', next_comparison: null },
              },
              next_step: 'create_delivery'
            },
          }
        }
      },
      remove_credit_block_automated: {
        display_name: 'Remove Credit Block (Automated)',
        type: 'automated',
        action: {
          document_type: 'example_document_type_uuid123',
          execution_script: 'example_script_uuid123',
        },
        next_step: {
          has_multiple_next_steps: false,
          next_step: 'create_delivery'
        }
      },
      create_delivery: {
        display_name: 'Create Delivery',
        type: 'automated',
        action: {
          document_type: 'example_document_type_uuid123',
          execution_script: 'example_script_uuid123',
        },
        next_step: {
          has_multiple_next_steps: false,
          next_step: 'create_invoice'
        }
      },
      create_invoice: {
        display_name: 'Create Invoice',
        type: 'automated',
        action: {
          document_type: 'example_document_type_uuid123',
          execution_script: 'example_script_uuid123',
        },
        next_step: {
          has_multiple_next_steps: false,
          next_step: 'end'
        }
      },
      end: {
        display_name: 'End',
        type: 'end',
      },
    }
  };

const x = {
    "display_name": "", 
    "documents": "", 
    "steps": { 
        "4cafce83-dd74-4f3a-91ab-06b14b17c349": 
            { 
                "step_uid": "4cafce83-dd74-4f3a-91ab-06b14b17c349", 
                "display_name": "Start", 
                "type": "start", 
                "manual_options": {}, 
                "next_step": { 
                    "conditional_value": "", 
                    "conditions": { 
                        "bfddc1e3-a739-4758-b8fc-2d12f9ac31e9": {
                            "comparison": [ { "operator": "", "value": "", "logic": "", "next_comparison": "" } ], 
                            "next_step": "bfddc1e3-a739-4758-b8fc-2d12f9ac31e9" 
                        }, 
                        "974d369f-d386-497c-b66f-72d11abdbdf9": { 
                            "comparison": [ { "operator": "", "value": "", "logic": "", "next_comparison": "" } ], 
                            "next_step": "974d369f-d386-497c-b66f-72d11abdbdf9" 
                        } 
                    } 
                } 
            }, 
        "bfddc1e3-a739-4758-b8fc-2d12f9ac31e9": { "step_uid": "bfddc1e3-a739-4758-b8fc-2d12f9ac31e9", "display_name": "", "type": "automated", "manual_options": {}, "next_step": { "conditional_value": "", "conditions": {} } }, "974d369f-d386-497c-b66f-72d11abdbdf9": { "step_uid": "974d369f-d386-497c-b66f-72d11abdbdf9", "display_name": "", "type": "automated", "manual_options": {}, "next_step": { "conditional_value": "", "conditions": {} } } } } 


        