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
        object_types_id = {'object_types_id': [
            k for k, v in all_types['nodes'].items() if v['properties']['type'] == 'OBJECT']}
        return JsonResponse(object_types_id)
    elif request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'OBJECT'
        # TODO create table if it doesnot exist
        # TODO validate against the field name 'type'

        added_node_id = pg_db.INSERT_NODE(
            table_name='types', data=data, id=data['typeName'])

        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)


def process(request):
    pe = ProcessEngine()
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_process = pg_db.SELECT(table_name='processes')
        pu_ids = []
        for k in all_process['nodes'].keys():
            pu_ids.append(k)

        pu_ids = {'pu_ids': pu_ids}
        return JsonResponse(pu_ids)
    elif request.method == 'POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)

        process_steps = data['processSteps'].strip()
        process_steps = process_steps.split(',')
        pe.create_process(pu_names=process_steps)
        process_data = pe.serialize()
        added_node_id = pg_db.INSERT_NODE(
            table_name='processes', id=data['processName'], data=process_data)

        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)

def process_graph(request, id):
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_process = pg_db.SELECT(table_name='processes')
        process_steps = {}
        process_json = all_process['nodes'][id]['properties']

        temp_pe = ProcessEngine()
        temp_pe.deserialize(process_json=process_json)
        steps = temp_pe.get_step_list()

        process_steps[id] = steps

        return JsonResponse(process_steps)
    elif request.method == 'POST':
        return HttpResponse(None)
    else:
        return HttpResponse("Request Method not allowed", status=405)