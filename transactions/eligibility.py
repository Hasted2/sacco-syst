from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from transactions.models import Transfer, LoanRepayment
from django.db.models import Sum

@api_view(['GET'])
def check_eligibility(request):
    user_id = request.GET.get('user_id')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    deposits = Transfer.objects.filter(user=user, amount__gt=0).aggregate(Sum('amount'))['amount__sum'] or 0
    repaid = LoanRepayment.objects.filter(loan__user=user).aggregate(Sum('amount'))['amount__sum'] or 0

    eligible = deposits >= 5000 and repaid >= 3000

    return Response({
        'user': user.username,
        'total_deposits': deposits,
        'total_repaid': repaid,
        'eligible': eligible
    })