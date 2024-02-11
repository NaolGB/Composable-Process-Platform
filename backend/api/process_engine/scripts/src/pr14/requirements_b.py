from data_api import DocumentApi, DocumentMasterDataApi, MasterDataApi

def transition():
    delivery_block = DocumentApi(document_id='SO_Doc_-_3').get_document_dict()['Delivery block']
    if delivery_block == 'F':
        return 'd'
    return 'c'

if __name__ == '__main__':
    transition()