import uuid
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.helpers import generate_id_from_display_name
from process_engine.mongo_utils import get_client_for_user
from process_engine.validation import validate_process_type
from tenant_provision.__permission__classes import IsUserAuthenticated, IsUserProfileAdmin, IsUserProfileAnalyst, IsUserProfileBusinessUser

class DocumentInstanceView(APIView):
    permission_classes = [IsUserAuthenticated, IsUserProfileBusinessUser]
    max_page_size = 50
    default_page_size = 10

    def get(self, request):
        # TODO: Implement this method
        return Response({"error": "Not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)
    
    def post(self, request):
        # NOTE: used for creating a new empty document instance
        db = get_client_for_user(request.user)
        collection = db.document_instance

        query = {}
        document_type_id = request.data.get('document_type')
        if document_type_id:
            query['document_type'] = document_type_id
        else:
            return Response({"error": "Document type is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        document_type_document = db.document_type.find_one({"_id": document_type_id})
        if not document_type_document:
            return Response({"error": "Document type not found"}, status=status.HTTP_404_NOT_FOUND)
        

        # initialize document instance
        new_document_instance = {
            "_id": str(uuid.uuid4()),
            "document_type": document_type_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "attributes": {},
            "master_data_accessed_fields": [],
            "master_data": [],
            "functions": document_type_document['functions']
        }

        # generate attributes from document type
        for k, v in document_type_document['attributes'].items(): 
            new_document_instance['attributes'][k] = v['default_value']

        # generate master_data_accessed_fields from document type
        for field_id in document_type_document['master_data_type']['fields_to_update']:
            if field_id not in new_document_instance['master_data_accessed_fields']:
                new_document_instance['master_data_accessed_fields'].append(field_id)
        for field_id in document_type_document['master_data_type']['fields_to_display']:
            if field_id not in new_document_instance['master_data_accessed_fields']:
                new_document_instance['master_data_accessed_fields'].append(field_id)

        # insert document instance
        try:
            result = collection.insert_one(new_document_instance)
            if result.acknowledged:
                return Response({"_id": new_document_instance['_id']}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Document not created"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)