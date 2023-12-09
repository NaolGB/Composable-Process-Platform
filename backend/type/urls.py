from django.urls import path, include
from type import views

urlpatterns = [
    path('object-types/', view=views.object_types, name='Object_types')
]
