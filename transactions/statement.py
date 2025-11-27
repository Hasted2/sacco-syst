from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from transactions.models import Transfer, Loan, LoanRepayment
from django.db.models import Sum

@api_view(['GET'])
def member_statement(request):
    user_id = request.GET.get('user_id')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    transfers = Transfer.objects.filter(user=user).order_by('-timestamp')
    loans = Loan.objects.filter(user=user).order_by('-requested_at')
    repayments = LoanRepayment.objects.filter(loan__user=user).order_by('-paid_at')

    total_deposits = transfers.filter(amount__gt=0).aggregate(Sum('amount'))['amount__sum'] or 0
    total_withdrawals = transfers.filter(amount__lt=0).aggregate(Sum('amount'))['amount__sum'] or 0
    total_loans = loans.aggregate(Sum('amount'))['amount__sum'] or 0
    total_repaid = repayments.aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        'user': user.username,
        'total_deposits': total_deposits,
        'total_withdrawals': total_withdrawals,
        'total_loans': total_loans,
        'total_repaid': total_repaid,
        'transfers': list(transfers.values()),
        'loans': list(loans.values()),
        'repayments': list(repayments.values())
    })