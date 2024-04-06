from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
from tenant_provision.__firebase__auth import FirebaseAuthentication
from rest_framework import exceptions


class FirebaseAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        firebase_auth = FirebaseAuthentication()

        try:
            auth_result = firebase_auth.authenticate(request)
            if auth_result:
                request.user, request.auth = auth_result
                return None
        except exceptions.AuthenticationFailed as e:
            return HttpResponse('Unauthorized user.', status=401)
        
        # If no auth result, return 401
        return HttpResponse('Unauthorized user.', status=401)