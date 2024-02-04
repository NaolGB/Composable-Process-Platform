from django.urls import path
from operations import views

urlpatterns = [
    path('operations-detail/<str:dtype>/<str:id>', view=views.events_data_details, name='events_data_details'),
    path('process-instance/<str:id>', view=views.process_instance, name='process_instance'),
    path('process-instances/<str:process_type_id>', view=views.many_process_instances, name='many_process_instances'),
]
