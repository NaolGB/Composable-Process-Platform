// Source objects
plant_object = {
	organization: "SC1",
	attributes: {
		organization: "string",
		name: "string",
		address: "string"
	}
},
material_object = {
	organization: "SC1",
	attributes: {
		organization: "string", // set default to organization's name
		name: "string", // set default to 'name'
		quantity: "float", // set default to 0.0
		plant: "object"
	}
}

// Document + Transaction oobjects
sales_order_materials_object = { // Transaction object
	organization: "SC1",
	source_instance: "materials", // chosen now; A Transaction object comes attached to a Source instance which can be mapped to
	mapped_attributes: {
		organization: {map_to: "organization", action: "read"},
		name: {map_to: "name", action: "read"},
		so_quantity: {map_to: "quantity", action: "update"},
		plant: {map_to: "plant", action: "read"}
	},
	extended_attributes: {
		source_instance: "materials"
	}
}
sales_order_object = { // Document object
	organization: "SC1",
	attributes: {
		organization: "SC1",
		transaction_objects: ["sales_order_materials_object"], // type chosen now
		delivery_block: "boolean" // set default to F
	}
}

// Process objects
order_management_object = {
	organization: "SC1",
	attributes: {
		organization: "SC1",
		documents: ["sales_order"],
		status: "NOT_INITIATED", // default is "start"
		steps: {
			create_sales_order: { // UI - PE looks at the option's actions and displays all the required fields for each option
				options: {
					cancel: {label: "Cancel", actions: {}}, // on UI this leads to "Home" page
					create_sales_order: {
						label: "Create Sales Order",
						actions: {
							create: { // PE creates SO, updates process status to INITIATED, update process's document_object
								documents: ["sales_order"],
								fields: {sales_order: ["__all__"]}, // every fields is visible and editable
							},
							initiate: "T" // PE validate one 'initiate' and one 'terminate' action per process - or maybe one 'teminate' per path
						},
					},
				},
				next_step: {check_material_availability: {requirement: {has_requrement:"F"}}}
			}, 
	
			check_material_availability: {
				options: {
					cancel: {label: "Cancel", actions: {}},
					set_delivery_block: {
						label: "Mark Delivery Block",
						action: {
							update: {
								documents: ["sales_order"],
								fields: {sales_order: ["delivery_block"]},
							}
						}
					}
				},
				next_step: { 
					// PE validation on process object validaton to make sure atleast and at most 1 next_step is reachable
					// PE validation on process instance validation to make sure the requirement for the step is fulfilled
					check_material_availability: {
						requirements: {
							has_requrement:"T",
							required_field_values: {sales_order: {delivery_block: "T"}}
						}
					},
					ship_goods: {
						requirements: {
							has_requrement:"T",
							required_field_values: {sales_order: {delivery_block: "F"}}
						}
					},
				}
			},
	
			ship_goods: {
				options: {
					cancel: {label: "Cancel", actions: {}, automated_actions: {}},
					option_ship_goods: {
						label: "Ship Goods",
						actions: {treminate: "T"}, // is end of process
						automated_actions: {   
							sales_order: { // Document
								transaction_objects: { // is for each because it is a list
									subtract: {
										amount: "so_quantity",
										from: "quanity" // must be mapped_to object
									}
								}
							}
						}
					}
				},
				next_step: {},
			}
		}
	}
}