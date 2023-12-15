from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from pgdb.processgraphdatabase.process_graph_db import ProcessGraphDB

import json

def make(request):
    if request.method == 'GET':
        return render(request, 'model/model.html')

def obj_types(request):
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_types = pg_db.SELECT(table_name='types')
        object_types = {k: v for k, v in all_types['nodes'].items() if v['properties']['type']=='OBJECT'}
        return JsonResponse(object_types)
    elif request.method =='POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'OBJECT'
        # TODO validate against the field name 'type'
        
        added_node_id = pg_db.INSERT_NODE(table_name='types', data=data, id=data['typeName'])
        
        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)
    
def act_types(request):
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        
        return HttpResponse(None)
    if request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'ACTIVITY'
        # TODO validate against the field name 'type'
        
        added_node_id = pg_db.INSERT_NODE(table_name='types', data=data, id=data['typeName'])
        
        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)