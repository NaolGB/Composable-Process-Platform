from django.urls import path
from . import views

urlpatterns = [
    path('add-object-type/', views.add_obj_type, name='add_obj_type')
]
