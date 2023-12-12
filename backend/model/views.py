from django.shortcuts import render

def add_obj_type(request):
    return render(request, 'model/add_obj.html')