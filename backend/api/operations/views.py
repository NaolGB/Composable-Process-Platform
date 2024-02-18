import os
from dotenv import load_dotenv

from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.event import ProcessEvent
from process_engine.process_instance import ProcessInstance

load_dotenv()
USERNAME = os.environ.get('DEFAULT_USER')

@api_view(['GET', 'POST', 'PUT'])
def events_data_details(request, dtype, id):
    """
    return details of the requested dtype instance with `id`
        ex: if the client want to get master_dtype_instance_a's all fields, it would send this GET reqest
                /api/operaitons/master_instance/master_dtype_instance_a
            the client would then recieve this response
                master_dtype_instance_a: {'field_1': 'value_1', 'field_2': 'value_2}
    {
        dtype: 'master_instance' | 'process_instance',
        id: 'id',
    }
    """
    if request.method == 'GET':
        response_data = ProcessEvent(user_name=USERNAME).get_data_details(dtype=dtype, id=id)
        return JsonResponse(response_data)
    elif request.method == 'POST':
        request_data = request.data
        response_data = ProcessEvent(user_name=USERNAME).post_data_detail(dtype=dtype, id=id, data=request_data)
        return JsonResponse({'message':"temp_repsonse"})
    elif request.method == 'PUT':
        request_data = request.data
        response_data = ProcessEvent(user_name=USERNAME).put_event_detail(dtype=dtype, id=id, data=request_data)
        return JsonResponse({'message':"temp_repsonse"})
    else:
        return HttpResponse(status=405)

@api_view(['GET', 'POST'])
def process_instance(request, id):
    if request.method == 'POST': # POSTs using process_type_id
        ProcessEvent().create_process_instance(process_type_id=id)
        return JsonResponse({'message':"pass"})
    elif request.method == 'GET': # GETs using process_instance_id
        parsed_response_data = ProcessInstance().get_process_instance(process_instance_id=id)
        return JsonResponse(parsed_response_data)
    else:
        return HttpResponse(status=405)
    
@api_view(['GET', 'POST'])
def many_process_instances(request, process_type_id):
    if request.method == 'GET':
        parsed_response_data = ProcessInstance().get_process_instance_ids(
            process_type_id=process_type_id)
        return JsonResponse({'ids': parsed_response_data})
    else:
        return HttpResponse(status=405)