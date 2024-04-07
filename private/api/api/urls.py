from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/design/master_data_type', include('master_data_type.urls')),
    path('api/general/user_profile', include('user_profile.urls')),
]
