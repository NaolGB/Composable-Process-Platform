from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.event import ProcessEvent as PEV

ORGANIZATION = 'SC1'

@api_view(['GET', 'POST'])
def process_instance(request, process_type_id):
    if request.method == 'POST':
        PEV().create_process_instance(process_type_id=process_type_id)
        return JsonResponse({'message':"pass"})
    else:
        return HttpResponse(status=405)