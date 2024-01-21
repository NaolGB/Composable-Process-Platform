from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.master_dtype import MasterDtype
from process_engine.transaction_type import TransactionType
from process_engine.document_type import DocumentType
from process_engine.process_type import ProcessType

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
    
@api_view(['GET', 'POST'])
def document_type(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        DocumentType().create(
            organization=ORGANIZATION,
            attributes=parsed_post_data
        )
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_repsonse_data = DocumentType().get_all_ids()
        return JsonResponse({'ids': parsed_repsonse_data})
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'POST'])
def process(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        ProcessType().create(
            organization=ORGANIZATION,
            design_status='00_GENERATED_NOT_CONNECTION_ADDED', # creating a new process
            documents=parsed_post_data['documents'],
            steps=parsed_post_data['steps'],
            name=parsed_post_data['name'],
        )
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_repsonse_data = ProcessType().get_all_ids()
        return JsonResponse({'ids': parsed_repsonse_data})
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'PUT'])
def single_process(request, id):
    if request.method == 'PUT':
        ProcessType().put_process(id=id, data=request.data)
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_response_data = ProcessType().get_process(processId=id)
        return JsonResponse(parsed_response_data)
    else:
        return HttpResponse(status=405)