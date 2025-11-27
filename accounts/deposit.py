from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import Account, Transaction
from accounts.serializers import TransactionSerializer, AccountSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get('amount')
    account_number = request.data.get('account_number')
    user = request.user

    # Validate amount
    try:
        deposit_amount = Decimal(amount)
    except Exception:
        return Response({'error': 'Invalid amount format. Please enter a number.'}, status=400)

    if deposit_amount <= 0:
        return Response({'error': 'Deposit amount must be greater than zero.'}, status=400)

    # Get account
    try:
        account = Account.objects.get(user=user, account_number=account_number)
    except Account.DoesNotExist:
        return Response({'error': 'Account not found. Please create an account first.'}, status=404)

    # Update balance
    account.balance += deposit_amount
    account.save()

    # Record transaction
    transaction = Transaction.objects.create(
        account=account,
        type="deposit",
        amount=deposit_amount
    )

    serializer = TransactionSerializer(transaction)
    account_serializer = AccountSerializer(account)

    return Response({
        "detail": f"Deposit successful: {transaction.amount} KSH",
        "transaction": serializer.data,
        "account": account_serializer.data
    })