from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Transfer
from transactions.serializers import TransferSerializer

@api_view(['GET'])
def transfer_history(request):
    transfers = Transfer.objects.all().order_by('-timestamp')
    serializer = TransferSerializer(transfers, many=True)
    return Response(serializer.data)