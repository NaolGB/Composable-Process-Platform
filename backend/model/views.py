from django.http import HttpResponse
from django.shortcuts import render
from pgdb.processgraphdatabase.process_graph_db import ProcessGraphDB

import json

def obj_types(request):
    pg_db = ProcessGraphDB()
    if request.method == 'GET':
        all_types = pg_db.SELECT(table_name='types')
        context = {
            'all_types': json.dumps(all_types)
        }
        # print(type(all_types))
        return render(request, 'model/add_obj.html', context)
    elif request.method =='POST':
        data = request.body.decode('utf-8')
        data = json.loads(data)
        data['type'] = 'OBJECT'
        # TODO validate against the field name 'type'
        
        added_node_id = pg_db.INSERT_NODE(table_name='types', data=data, id=data['typeName'])
        
        return HttpResponse(added_node_id)
    else:
        return HttpResponse("Request Method not allowed", status=405)