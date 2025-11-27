from rest_framework.response import Response
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get('amount')
    user = request.user

    logger.info(f"Deposit request received from user: {user.username}, amount: {amount}")

    if not amount or float(amount) <= 0:
        logger.warning(f"Invalid deposit amount: {amount}")
        return Response({'error': 'Invalid deposit amount'}, status=400)

    try:
        transaction = Transaction.objects.create(
            user=user,
            type="Deposit",
            amount=amount
        )
        logger.info(f"Transaction created: {transaction}")
    except Exception as e:
        logger.error(f"Error creating transaction: {e}")
        return Response({'error': 'Transaction failed'}, status=500)

    serializer = TransactionSerializer(transaction)
    logger.debug(f"Serialized transaction: {serializer.data}")
    return Response({
        "detail": f"Deposit successful: {transaction.amount} KSH",
        "transaction": serializer.data
    })
