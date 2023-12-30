
sales_order_materials = { // generated on the '' process on 'create_sales_order' step and attached to docuumnet ''
    so_mat_1: {
        source_instance: "mat1",
        organization: "SC1",
        name: "Mac Book Air (2020)",
        so_quantity: 15.0,
        plant: "pl1",
    },
    so_mat_2: {
        source_instance: "mat2",
        organization: "SC1",
        name: "Dell Monitor (24in)",
        so_quantity: 7.0,
        plant: "pl2",
    }
	
}

sales_order_docs = {
    so_doc_1: {
        organization: "SC1",
        transaction_objects: ["so_mat_1", "so_mat_2"], 
        delivery_block: "F"
    }
}

// create_sales_order
order_management_inst_1 = {
	organization: "SC1",
	documents: ["so_doc_1"],
	status: "create_sales_order", // change status to 'create_sales_order'
	steps: {
		create_sales_order: {
			options: {
				cancel: {label: "Cancel", actions: {}}, // on UI this leads to "Home" page
				create_sales_order: {
					label: "Create Sales Order",
					actions: {
						create: { 
							documents: ["so_doc_1"], // document chosen updated to be the instace
							fields: {sales_order: ["__all__"]},
						},
                        initiate: "T"
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
							documents: ["so_doc_1"],// document chosen updated to be the instace
							fields: {sales_order: ["delivery_block"]},
						}
					}
				}
			},
			next_step: { 
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