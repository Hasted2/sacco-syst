from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from transactions.models import Loan, LoanRepayment
from django.db.models import Sum

@api_view(['GET'])
def loan_balance(request):
    user_id = request.GET.get('user_id')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    approved_loans = Loan.objects.filter(user=user, status='approved')
    total_loaned = approved_loans.aggregate(total=Sum('amount'))['total'] or 0

    repaid = LoanRepayment.objects.filter(loan__in=approved_loans).aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        'user': user.username,
        'total_loaned': total_loaned,
        'total_repaid': repaid,
        'outstanding_balance': total_loaned - repaid
    })