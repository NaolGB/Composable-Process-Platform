from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/master_data_type', include('master_data_type.v1.urls')),
    path('api/v1/design/', include('design.v1.urls')),
]
