from django.urls import path
from .views import ProcessTypeView

urlpatterns = [
    path('', ProcessTypeView.as_view(), name='process-type'),
]