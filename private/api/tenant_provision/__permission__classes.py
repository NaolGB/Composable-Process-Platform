from rest_framework import permissions
from tenant_provision.__firebase__auth import FirebaseAuthentication

class IsUserAuthenticated(permissions.BasePermission):
    """
    Custom permission to only allow authenticated users to access the view.
    """

    def has_permission(self, request, view):
        firebase_auth = FirebaseAuthentication()

        try:
            auth_result = firebase_auth.authenticate(request)
            if auth_result:
                return True
        except:
            return False

        return False

class IsUserProfileAdmin(permissions.BasePermission):
    """
    Custom permission to only allow user profile admins to access the view.
    """

    def has_permission(self, request, view):
        try:
            user_profile_auth = FirebaseAuthentication().authenticate(request)
            user_profile = None
            if user_profile_auth:
                user_profile = user_profile_auth[0]
                return user_profile.role == 'admin'
        except:
            return False
        
        return False
    
class IsUserProfileAnalyst(permissions.BasePermission):
    """
    Custom permission to only allow analysts to access the view.
    """

    def has_permission(self, request, view):
        try:
            user_profile_auth = FirebaseAuthentication().authenticate(request)
            user_profile = None
            if user_profile_auth:
                user_profile = user_profile_auth[0]
                return user_profile.role in ['analyst', 'admin']
        except:
            return False
        
        return False

class IsUserProfileBusinessUser(permissions.BasePermission):
    """
    Custom permission to only allow business users to access the view.
    """

    def has_permission(self, request, view):
        try:
            user_profile_auth = FirebaseAuthentication().authenticate(request)
            user_profile = None
            if user_profile_auth:
                user_profile = user_profile_auth[0]
                return user_profile.role in ['business-user', 'analyst', 'admin']
        except:
            return False
        
        return False