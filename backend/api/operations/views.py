from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.event import ProcessEvent
from process_engine.process_instance import ProcessInstance

ORGANIZATION = 'SC1'

@api_view(['GET', 'POST'])
def process_instance(request, process_type_id):
    if request.method == 'POST':
        ProcessEvent().create_process_instance(process_type_id=process_type_id)
        return JsonResponse({'message':"pass"})
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'POST'])
def many_process_instances(request, process_type_id):
    if request.method == 'GET':
        parsed_response_data = ProcessInstance().get_process_instances(process_type_id=process_type_id)
        return JsonResponse({'data': parsed_response_data})
    else:
        return HttpResponse(status=405)