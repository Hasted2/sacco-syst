from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Loan

@api_view(['GET'])
def loan_contract(request):
    loan_id = request.GET.get('loan_id')

    try:
        loan = Loan.objects.select_related('user').get(id=loan_id)
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=404)

    contract = f"""
    LOAN AGREEMENT

    Borrower: {loan.user.username}
    Amount: {loan.amount}
    Reason: {loan.reason}
    Status: {loan.status}
    Date: {loan.requested_at.strftime('%Y-%m-%d')}

    Terms:
    - Repay in 3 monthly installments
    - Notify SACCO of any delays
    - Subject to SACCO bylaws

    Signature: ______________________
    """

    return Response({'contract': contract.strip()})