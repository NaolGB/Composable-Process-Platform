import process_engine as PE
import process_object as PO

def a_check_mat_availability(requested_material: PO.ProcessObjectInstance, requestd_qty: float):
    if (
        requested_material.a_object.attributes['requested_qty'] > 
        requestd_qty.a_object.attributes['src_mat_id']
    )