from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')), # for login/logout in browsable api
    path('model/', include('model.urls')),
    path('operations/', include('operations.urls'))
]
