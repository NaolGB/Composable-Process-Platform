from rest_framework.decorators import api_view
from rest_framework.response import Response
from pgdb import process_graph_db as pgdb

obj_type_db = pgdb.ProcessGraphDB()
obj_type_db.load(table_type='TYPE')


@api_view(['GET', 'POST'])
def object_types(request):
    if request.method == 'GET':
        return Response(obj_type_db.represent())
    elif request.method == 'POST':
        print(request)
        data = request.data
        key_valid_data = {key.lower(): value for key, value in data.items()}



        # TODO Validate data
        obj_created_id = obj_type_db.INSERT(table_type='TYPE', data=key_valid_data, node_type='OBJECT')
        return Response(obj_created_id)
