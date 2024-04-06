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
        db = get_services_client()
        collection = db.profiles

        token = request.headers.get('Authorization')
        if not token:
            raise exceptions.AuthenticationFailed('No authentication token provided')

        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token["uid"]
        except auth.FirebaseError:
            raise exceptions.AuthenticationFailed('Invalid authentication token')
        
        try:
            profile = collection.find_one({'uid': uid})
            if not profile:
                raise exceptions.AuthenticationFailed('User not found')
        except Exception:
            raise exceptions.AuthenticationFailed('Error fetching user profile')

        return (Profile(uid, profile), token)