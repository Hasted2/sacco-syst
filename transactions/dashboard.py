from rest_framework.decorators import api_view
from rest_framework.response import Response
from loans import models
from transactions.models import Transfer, Loan
from django.db.models import Sum, Count
from transactions.utils import admin_required


@api_view(['GET'])
@admin_required
def dashboard_summary(request):
    deposits = Transfer.objects.filter(amount__gt=0).aggregate(total=Sum('amount'))['total'] or 0
    withdrawals = Transfer.objects.filter(amount__lt=0).aggregate(total=Sum('amount'))['total'] or 0
    loans = Loan.objects.aggregate(
        total_requested=Sum('amount'),
        total_approved=Sum('amount', filter=models.Q(status='approved')),
        total_pending=Count('id', filter=models.Q(status='pending'))
    )

    return Response({
        'total_deposits': deposits,
        'total_withdrawals': withdrawals,
        'loan_summary': loans
    })