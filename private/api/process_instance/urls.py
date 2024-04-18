from django.urls import path
from .views import ProcessInstanceView

urlpatterns = [
    path('', ProcessInstanceView.as_view(), name='process-instance'),
]