from django.urls import path
from .views import MasterDataTypeView

urlpatterns = [
    path('', MasterDataTypeView.as_view(), name='master-data-type'),
]