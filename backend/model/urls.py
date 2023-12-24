from django.urls import path
from . import views

urlpatterns = [
    path('make/', views.make, name='make'),
    path('process-types/', views.process_types, name='process_types'),
    path('object-types/', views.object_types, name='object_types'),
]
