from django.urls import path
from . import views

urlpatterns = [
    path('object-types/', views.obj_types, name='obj_types')
]
