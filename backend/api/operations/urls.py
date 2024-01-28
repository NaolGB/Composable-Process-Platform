from django.urls import path
from operations import views

urlpatterns = [
    path('process-instance/<str:process_type_id>', view=views.process_instance, name='process_instance'),
]
