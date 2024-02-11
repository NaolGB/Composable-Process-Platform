from data_api import DocumentApi, DocumentMasterDataApi, MasterDataApi

def transition():
    delivery_block = DocumentApi(process_type='pr14', process_instance_id='pr14_00_000_010', document_id='SO_Doc_-_3').get_document_dict()['Delivery block']
    if delivery_block == 'F':
        print('d')
    else:
        print('c')

if __name__ == '__main__':
    transition()