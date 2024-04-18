from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.helpers import generate_id_from_display_name
from process_engine.mongo_utils import get_client_for_user
from process_engine.validation import validate_process_type
from tenant_provision.__permission__classes import IsUserAuthenticated, IsUserProfileAdmin, IsUserProfileAnalyst, IsUserProfileBusinessUser

class ProcessTypeView(APIView):
    permission_classes = [IsUserAuthenticated, IsUserProfileAnalyst]
    max_page_size = 50
    default_page_size = 10

    def get(self, request):
        
        db = get_client_for_user(request.user)
        collection = db.process_type

        # Handle dynamic page size with limits
        try:
            page_size = int(request.query_params.get('page_size', self.default_page_size))
            page_size = min(page_size, self.max_page_size)
        except ValueError:
            page_size = self.default_page_size

        # Handle page number
        try:
            page = int(request.query_params.get('page', 1))
            page = max(page, 1)
        except ValueError:
            page = 1

        skip_amount = (page - 1) * page_size

        # Fields filtering
        fields = request.query_params.get('fields')
        if fields:
            requested_fields = set(fields.split(','))
            fields_dict = {field: 1 for field in requested_fields}
        else:
            fields_dict = None

        query = {}
        # ID handling 
        id_param = request.query_params.get('id')
        if id_param:
            query['_id'] = id_param

        # Fetch data with pagination and fields filtering
        try:
            if 'id' in request.query_params:  # Detail view for a specific document
                doc = collection.find_one(query, fields_dict)
                if not doc:
                    return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
                return Response(doc, status=status.HTTP_200_OK)
            else:  # List view, no pagination
                docs = list(collection.find(query, fields_dict))
                return Response(docs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        db = get_client_for_user(request.user)
        collection = db.process_type

        document = request.data
        
        # Validate the incoming data
        if not validate_process_type(document):
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        
        # remove ID if present
        if '_id' in document:
            del document['_id']

        # Generate ID
        base_id = generate_id_from_display_name(document['display_name'])
        document['_id'] = self.ensure_unique_id(collection, base_id)

        try:
            result = collection.insert_one(document)
            if result.acknowledged:
                return Response({"_id": result.inserted_id, 'disply_name': document['display_name']}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Operation not acknowledged"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    # helper methods that need access to the database
    def ensure_unique_id(self, collection, base_id):
        # Check if the base_id exists; if so, create a variation until a unique id is found
        unique_id = base_id
        variation = 1
        while collection.find_one({"_id": unique_id}):
            unique_id = f"{base_id}_{variation}"
            variation += 1
        return unique_id