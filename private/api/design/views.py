from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from process_engine.master_data import MasterDataType as MasterDataTypeService # Renamed to avoid conflict
from process_engine.helpers import ProcessEngineResponse

class MasterDataTypeView(APIView):
    """
    Master Data Type API
    """
    def get(self, request):
        """
        Get a master data type by ID.
        """
        id = request.query_params.get('id')
        fields = request.query_params.get('fields')
        fields = fields.split(",") if fields else None

        response = MasterDataTypeService().get(id, fields=fields)
        if response.success == False:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a master data type.
        """
        response = MasterDataTypeService().create(data=request.data)

        if response.success == False:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_200_OK)


    def patch(self, request):
        """
        Update a master data type by ID. 
        """
        id = request.data.get('id') 
        new_fields = request.data.get('new_fields')
        rename_fields = request.data.get('rename_fields')

        response = MasterDataTypeService().update(id, new_fields, rename_fields)

        if response.success == False:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={'success': response.success, 'message': response.message, 'data': response.data}, status=status.HTTP_200_OK)
