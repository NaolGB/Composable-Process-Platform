from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.v1.mongo_utils import get_client_for_user
from bson.objectid import ObjectId
from bson.errors import InvalidId

class MasterDataTypeView(APIView):
    max_page_size = 50
    default_page_size = 10

    def get(self, request):
        db = get_client_for_user(request.user)
        collection = db.master_data_type

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

        # ID handling 
        id_param = request.query_params.get('id')
        query = {}
        if id_param:
            # Optionally, implement logic here to determine if 'id_param' is an ObjectId or another type
            # For simplicity, this example directly uses 'id_param' without conversion
            query['_id'] = id_param

        # Fetch data with pagination and fields filtering
        try:
            if 'id' in request.query_params:  # Detail view for a specific document
                doc = collection.find_one(query, fields_dict)
                if not doc:
                    return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
                return Response(doc, status=status.HTTP_200_OK)
            else:  # List view with pagination
                docs = list(collection.find(query, fields_dict).skip(skip_amount).limit(page_size))
                return Response(docs, status=status.HTTP_200_OK)
        except Exception as e:
            # Handling unexpected errors more generically
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)