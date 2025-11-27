from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Loan, LoanRepayment
from transactions.serializers import LoanRepaymentSerializer
from django.utils import timezone

@api_view(['POST'])
def repay_loan(request):
    data = request.data
    loan_id = data.get('loan_id')
    amount = data.get('amount')

    try:
        loan = Loan.objects.get(id=loan_id)
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=404)

    if loan.status != 'approved':
        return Response({'error': 'Loan is not approved'}, status=400)

    repayment = LoanRepayment.objects.create(
        loan=loan,
        amount=amount,
        paid_at=timezone.now()
    )
    serializer = LoanRepaymentSerializer(repayment)
    return Response(serializer.data)