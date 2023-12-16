from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from pgdb.processgraphdatabase.process_graph_db import ProcessGraphDB
from pgdb.processengine.process_engine import ProcessEngine

import json
# FIXME only send keys, not the entire object

def make(request):
    if request.method == 'GET':
        return render(request, 'model/model.html')

def object_types(request):
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_types = pg_db.SELECT(table_name='types')
        object_types_data = {k: v for k, v in all_types['nodes'].items() if v['properties']['type']=='OBJECT'}
        return JsonResponse(object_types_data)
    elif request.method =='POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'OBJECT'
        # TODO create table if it doesnot exist
        # TODO validate against the field name 'type'
        
        added_node_id = pg_db.INSERT_NODE(table_name='types', data=data, id=data['typeName'])
        
        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)
    
def process(request):
    pe =ProcessEngine()
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_process = pg_db.SELECT(table_name='processes')
        process_data = {k: v['properties'] for k, v in all_process['nodes'].items()}
        return JsonResponse(process_data)
    elif request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        # TODO create table if it doesnot exist
        # TODO validate against the field name 'type'
        # TODO validate against the data types
        # TODO validate against repeated steps

        process_steps = data['processSteps'].strip()
        process_steps = process_steps.split(',')
        print(process_steps)
        pe.create_process(pu_names=process_steps)
        process_data = pe.serialize()
        added_node_id = pg_db.INSERT_NODE(table_name='processes', id=data['processName'], data=process_data)

        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)