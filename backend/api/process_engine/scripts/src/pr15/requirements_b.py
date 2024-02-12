from data_api import DocumentApi

def traisition():
    delivery_block = DocumentApi(process_type='pr15', process_instance_id='pr15_00_000_001', document_id='SO_Doc_-_3').get_document_dict()['Delivery block']
    if delivery_block == 'F':
        print('d')
        return
    else:
        print('c')
        return

if __name__ == '__main__':
    traisition()