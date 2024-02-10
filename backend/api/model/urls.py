from django.urls import path
from model import views

urlpatterns = [
    path('master-data-type/', view=views.master_dtype, name='master_dtype'),
    path('master-data-type/<str:id>', view=views.single_master_dtype, name='single_master_dtype'),
    path('document-type/', view=views.document_type, name='document_type'),
    path('document-type/<str:id>', view=views.single_document_type, name='single_document_type'),
    path('process-type/', view=views.process, name='process_type'),
    path('process/<str:id>', view=views.single_process, name='single_process'),
    path('process/publish/<str:id>', view=views.single_process_publish, name='single_process_publish'),
]
