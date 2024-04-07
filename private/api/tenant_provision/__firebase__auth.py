from django.contrib.auth.models import AnonymousUser
from rest_framework import authentication
from rest_framework import exceptions
import firebase_admin.auth as auth
from process_engine.mongo_utils import get_services_client

class Profile(AnonymousUser):
    """
    Custom user model for Firebase authentication.
    Becase BasedAuthentication expects a user object, we need to create a custom user.
    """
    def __init__(self, uid, profile=None) -> None:
        super().__init__()
        self.uid = uid
        self.profile = profile

    @property
    def is_authenticated(self):
        return True


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        mongo_client = get_services_client()
        db = mongo_client['dev']
        profile_collection = db.profile
        

        token = request.headers.get('Authorization')
        
        token_parts = token.split()
        if token_parts[0].lower() != 'bearer' or len(token_parts) != 2:
            raise exceptions.AuthenticationFailed('Invalid authentication token format')
        token = token_parts[1]
        
        if not token:
            raise exceptions.AuthenticationFailed('No authentication token provided')

        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token["uid"]
        except auth.AuthError:
            raise exceptions.AuthenticationFailed('Invalid authentication token')
        
        try:
            profile = profile_collection.find_one({'uid': uid})
            if not profile:
                raise exceptions.AuthenticationFailed('User not found')
        except Exception:
            raise exceptions.AuthenticationFailed('Error fetching user profile')

        print('Profile:', profile)
        return (Profile(uid, profile), token)