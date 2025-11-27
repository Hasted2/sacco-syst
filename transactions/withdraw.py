from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    amount = request.data.get('amount')
    user = request.user

    if not amount or float(amount) <= 0:
        return Response({'error': 'Invalid withdrawal amount'}, status=400)

    # Optional: check if user has enough balance
    # For now, just record the withdrawal
    transaction = Transaction.objects.create(
        user=user,
        type="Withdrawal",
        amount=amount
    )

    serializer = TransactionSerializer(transaction)
    return Response({
        "detail": f"Withdrawal successful: {transaction.amount} KES",
        "transaction": serializer.data
    })