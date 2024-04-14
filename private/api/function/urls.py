from django.urls import path
from .views import FunctionView

urlpatterns = [
    path('', FunctionView.as_view(), name='functions-function'),
]