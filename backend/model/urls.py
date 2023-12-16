from django.urls import path
from . import views

urlpatterns = [
    path('make/', views.make, name='make'),
    path('process/', views.process, name='process'),
    path('object-types/', views.object_types, name='obj_types'),
]
