from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Loan, RepaymentSchedule
from datetime import timedelta
from django.utils import timezone
from transactions.utils import admin_required


@api_view(['POST'])
@admin_required
def approve_loan(request):
    data = request.data
    loan_id = data.get('loan_id')
    action = data.get('action')  # 'approve' or 'reject'

    try:
        loan = Loan.objects.get(id=loan_id)
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=404)

    if action == 'approve':
        if loan.status == 'approved':
            return Response({'message': 'Loan is already approved'}, status=400)

        loan.status = 'approved'
        loan.save()

        # Create 3 monthly repayment installments
        installment = float(loan.amount) / 3
        for i in range(3):
            due_date = timezone.now().date() + timedelta(days=30 * (i + 1))
            RepaymentSchedule.objects.create(
                loan=loan,
                due_date=due_date,
                amount_due=installment
            )

        return Response({'message': 'Loan approved and repayment schedule created'})

    elif action == 'reject':
        loan.status = 'rejected'
        loan.save()
        return Response({'message': 'Loan rejected'})

    else:
        return Response({'error': 'Invalid action. Use "approve" or "reject".'}, status=400)