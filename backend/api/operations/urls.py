from django.urls import path
from operations import views

urlpatterns = [
    path('process-instance/<str:process_type_id>', view=views.process_instance, name='process_instance'),
    path('process-instances/<str:process_type_id>', view=views.many_process_instances, name='many_process_instances'),
]
