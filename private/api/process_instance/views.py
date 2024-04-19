import uuid
from datetime import datetime
from django.http import HttpRequest, QueryDict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.helpers import generate_id_from_display_name
from process_engine.mongo_utils import get_client_for_user
from process_engine.validation import validate_process_type
from document_instance.views import DocumentInstanceView
from tenant_provision.__permission__classes import IsUserAuthenticated, IsUserProfileAdmin, IsUserProfileAnalyst, IsUserProfileBusinessUser

class ProcessInstanceView(APIView):
    permission_classes = [IsUserAuthenticated, IsUserProfileBusinessUser]
    max_page_size = 50
    default_page_size = 10

    def get(self, request):
        db = get_client_for_user(request.user)
        collection = db.process_instance

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
        # filter by process_type
        process_type = request.query_params.get('process_type')
        if process_type:
            query = {"process_type": process_type}

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
        # # NOTE: used for creating a new empty process instance
        # db = get_client_for_user(request.user)
        # collection = db.process_instance

        # # filter by process_type
        # process_type_id = request.query_params.get('process_type')
        # if not process_type_id:
        #     return Response({"error": "Please provide a Process Type"}, status=status.HTTP_400_BAD_REQUEST)
        
        # process_type_document = db.process_type.find_one({"_id": process_type_id})
        # if not process_type_document:
        #     return Response({"error": "Process Type not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # # initiate document
        # new_process_instance_document = {
        #     "_id": str(uuid.uuid4()), 
        #     "process_type": process_type_id,
        #     "document_instances": [],
        #     "current_step": 'start',
        #     "status": "created", # created, in-progress, paused, completed, failed, terminated
        #     "created_at": datetime.now(),
        #     "updated_at": datetime.now(),
        #     "created_by": request.user.username,
        #     "updated_by": request.user.username,
        # }

        # # add document instances
        # process_type_docume_type_ids = process_type_document['documents'].split(',')
        # auth_token = request.headers.get('Authorization').split(' ')[1]

        # if not auth_token:
        #     return Response({"error": "No authentication token provided"}, status=status.HTTP_400_BAD_REQUEST)
        # headers = {'Authorization': f'Bearer {auth_token}'}

        # for document_type_id in process_type_docume_type_ids:
        #     # request_for_document_instance = HttpRequest()
        #     # request_for_document_instance.user = request.user
        #     # request_for_document_instance.method = 'POST'

        #     # # Properly setting POST data using QueryDict
        #     # request_for_document_instance.POST = QueryDict('', mutable=True)
        #     # request_for_document_instance.POST.update({'document_type': document_type_id})
            
        #     # # Set headers correctly for internal processing
        #     # for key, value in headers.items():
        #     #     request_for_document_instance.META[f'HTTP_{key.upper().replace("-", "_")}'] = value

        #     # # Call the DocumentInstanceView to create a new document instance
        #     # print(request_for_document_instance)
        #     # response = DocumentInstanceView.as_view()(request_for_document_instance)

        #     # # print(response.content)

        #     # if response.status_code == status.HTTP_201_CREATED:
        #     #     new_process_instance_document['document_instances'].append(response.data['_id'])
        #     # else:
        #     #     return Response({"error": "Document instance creation failed"}, status=status.HTTP_400_BAD_REQUEST)

        #     # print(response.data)

        # # post the new process instance
        # try:
        #     result = collection.insert_one(new_process_instance_document)
        #     if result.acknowledged:
        #         return Response(new_process_instance_document, status=status.HTTP_201_CREATED)
        #     else:
        #         return Response({"error": "Operation not acknowledged"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        pass
