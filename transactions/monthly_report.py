from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Transfer
from django.db.models.functions import TruncMonth
from django.db.models import Sum

@api_view(['GET'])
def monthly_summary(request):
    data = (
        Transfer.objects
        .annotate(month=TruncMonth('timestamp'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )
    return Response(data)