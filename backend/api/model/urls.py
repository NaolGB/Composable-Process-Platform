from django.urls import path
from model import views

urlpatterns = [
    path('master-data-type/', view=views.master_dtype, name='master_dtype'),
    path('transaction-type/', view=views.transaction_type, name='transaction_type')
]
