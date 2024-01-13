from django.urls import path
from model import views

urlpatterns = [
    path('master-data-type/', view=views.master_dtype, name='master_dtype'),
    path('transaction-type/', view=views.transaction_type, name='transaction_type'),
    path('document-type/', view=views.document_type, name='document_type'),
    path('process-type/', view=views.process, name='process_type'),
]
