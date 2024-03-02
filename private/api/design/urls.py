from django.urls import path
from .views import MasterDataTypeView

urlpatterns = [
    path('master-data-type/', MasterDataTypeView.as_view(), name='master-data-type-list-create'),
    path('master-data-type/<int:id>/', MasterDataTypeView.as_view(), name='master-data-type-detail'),
]
