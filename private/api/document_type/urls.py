from django.urls import path
from .views import DocumentTypeView

urlpatterns = [
    path('', DocumentTypeView.as_view(), name='document-type'),
]