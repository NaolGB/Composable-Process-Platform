from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.master_dtype import MasterDtype
from process_engine.document_type import DocumentType
from process_engine.process_type import ProcessType

ORGANIZATION = 'SC1'

@api_view(['GET', 'POST'])
def master_dtype(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        parsed_post_data['organization']=ORGANIZATION
        MasterDtype().create(data=parsed_post_data)
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_response_data = MasterDtype().get_all_ids()
        return JsonResponse({'ids': parsed_response_data})
    else:
        return HttpResponse(status=405) # Method not allowed
    
@api_view(['GET', 'POST'])
def single_master_dtype(request, id):
    if request.method == 'POST':
        pass
        return JsonResponse({})
    elif request.method == 'GET':
        parsed_response_data = MasterDtype().get_master_dtype(id)
        return JsonResponse(parsed_response_data)
    else:
        return HttpResponse(status=405) # Method not allowed
    
@api_view(['GET', 'POST'])
def document_type(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        parsed_post_data['organization'] = ORGANIZATION
        DocumentType().create(data=parsed_post_data)
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        parsed_repsonse_data = DocumentType().get_all_ids()
        return JsonResponse({'ids': parsed_repsonse_data})
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'POST'])
def single_document_type(request, id):
    if request.method == 'GET':
        parsed_repsonse_data = DocumentType().get_document_type(documentId=id)
        return JsonResponse(parsed_repsonse_data)
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'POST'])
def process(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        parsed_post_data['organization'] = ORGANIZATION
        parsed_post_data['design_status']=['00_GENERATED_NOT_CONNECTION_ADDED'] # creating a new process
        ProcessType().create(data=parsed_post_data)
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
    
@api_view(['GET', 'PUT'])
def single_process_publish(request, id):
    if request.method == 'PUT':
        ProcessType().validate_and_publish_process(process_id=id, data=request.data)
        return JsonResponse({'message':"success"})
    else:
        return HttpResponse(status=405)