from django.urls import path
from . import views

urlpatterns = [
    path('make/', views.make, name='make'),
    path('process/', views.process, name='process'),
    path('process-graph/<str:id>', views.process_graph, name='process_graph'),
    path('object-types/', views.object_types, name='object_types'),
]
