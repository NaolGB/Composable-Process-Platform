from django.urls import path
from . import views

urlpatterns = [
    path('make/', views.make, name='make'),
    path('object-types/', views.obj_types, name='obj_types'),
    path('activity-types/', views.act_types, name='act_types')
]
