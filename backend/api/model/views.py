from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.master_dtype import MasterDtype
from process_engine.transaction_type import TransactionType
from process_engine.document_type import DocumentType

ORGANIZATION = 'SC1'

@api_view(['GET', 'POST'])
def master_dtype(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        MasterDtype().create(
            organization=ORGANIZATION,
            attributes=parsed_post_data,
        )
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_response_data = MasterDtype().get_all_ids()
        return JsonResponse({'ids': parsed_response_data})
    else:
        return HttpResponse(status=405) # Method not allowed

@api_view(['GET', 'POST'])
def transaction_type(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        TransactionType().create(
            organization=ORGANIZATION,
            attributes=parsed_post_data
        )
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_repsonse_data = TransactionType().get_all_ids()
        return JsonResponse({'ids': parsed_repsonse_data})
    else:
        return HttpResponse(status=405)
    
@ api_view(['GET', 'POST'])
def document_type(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        DocumentType().create(
            organization=ORGANIZATION,
            attributes=parsed_post_data
        )
        return JsonResponse({'message':"success"})
    else:
        return HttpResponse(status=405)