from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.mongo_utils import get_services_client
from tenant_provision.__firebase__auth import Profile, FirebaseAuthentication
from tenant_provision.__permission__classes import IsUserAuthenticated, IsUserProfileAdmin, IsUserProfileAnalyst, IsUserProfileBusinessUser


class UserProfileView(APIView):
    permission_classes = [IsUserAuthenticated, IsUserProfileBusinessUser]
    
    def get(self, request):
        db = get_services_client()
        collection = db.profile

        # NOTE: No ID handling becaus the ID = UID of the user who is logged in
        user_profile_auth = FirebaseAuthentication().authenticate(request)

        user_profile = None
        if user_profile_auth:
            user_profile = user_profile_auth[0]
        
        # Fields filtering
        fields = request.query_params.get('fields')
        if fields:
            requested_fields = set(fields.split(','))
            fields_dict = {field: 1 for field in requested_fields}
        else:
            fields_dict = None

        try:
            if fields_dict:
                requested_user_profile = {k: user_profile.__dict__[k] for k in fields_dict.keys()}
            else:
                requested_user_profile = user_profile.__dict__
            return Response(requested_user_profile, status=status.HTTP_200_OK) 
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)