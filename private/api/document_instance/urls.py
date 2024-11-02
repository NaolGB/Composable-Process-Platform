from django.urls import path
from .views import DocumentInstanceView

urlpatterns = [
    path('', DocumentInstanceView.as_view(), name='document-instance'),
]