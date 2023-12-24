from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from pe.processengine.process_engine import ProcessEngine
from pe.processengine.process_object import ProcessObject

import json
# FIXME only send keys, not the entire object

def make(request):
    if request.method == 'GET':
        return render(request, 'model/model.html')

def object_types(request):
    po = ProcessObject()
    if request.method == 'GET':
        ids = po.read_all_ids()
        return JsonResponse({'ids': ids})
    
    elif request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'OBJECT'
        po.add_object(object_data=data)
        return HttpResponse('Success')
    else:
        return HttpResponse("Request Method not allowed", status=405)

def process_types(request):
    pe = ProcessEngine()
    if request.method == 'GET':
        ids = pe.read_all_ids()
        return JsonResponse({'ids': ids})
    elif request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'PROCESS'
        pe.create_process_from_list(data)

        return HttpResponse('Success')
    else:
        return HttpResponse("Request Method not allowed", status=405)


def object_type(request, id):
    pass

def process_type(request, id):
    pass