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
        # TODO: Implement this method
        return Response({"error": "Not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)