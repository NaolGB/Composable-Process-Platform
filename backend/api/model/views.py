from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from process_engine.master_dtype import MasterDtype

@api_view(['GET', 'POST'])
def master_dtype(request):
    if request.method == 'POST':
        parsed_post_data = request.data
        organization = 'SC1'
        MasterDtype().create(
            organization=organization,
            attributes=parsed_post_data,
        )
        return JsonResponse({'message':"success"})
    elif request.method == 'GET':
        return JsonResponse({'ids': ['a', 'b']})
    else:
        return HttpResponse(status=405) # Method not allowed