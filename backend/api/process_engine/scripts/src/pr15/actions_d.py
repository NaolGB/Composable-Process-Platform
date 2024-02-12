from data_api import DocumentMasterDataApi, DocumentMasterDataWrapper, MasterDataWrapper, MasterDataApi

def action():
    document_master_data = DocumentMasterDataApi(process_type='pr15', process_instance_id='pr15_00_000_001', document_id='SO_Doc_-_3').get_document_master_data_dict()

    for k, v in document_master_data.items():
        document_master_data_qty = v['qty']
        master_data_qty = MasterDataApi(master_data_type='material', master_data_id=k).get_master_data_dict()['qty']
        print(MasterDataWrapper(master_data_type='material', master_data_id=k, data={'qty': float(master_data_qty)-float(document_master_data_qty)}))
    return
    
if __name__ == '__main__':
    action()