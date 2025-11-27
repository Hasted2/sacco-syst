from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from transactions.models import Loan
from transactions.serializers import LoanSerializer

@api_view(['POST'])
def request_loan(request):
    data = request.data
    user_id = data.get('user_id')
    amount = data.get('amount')
    reason = data.get('reason', 'Loan request')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    loan = Loan.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        status='pending',
        requested_at=timezone.now()
    )
    serializer = LoanSerializer(loan)
    return Response(serializer.data)