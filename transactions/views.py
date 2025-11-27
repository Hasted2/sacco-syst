# transactions/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Transaction
from .serializers import TransactionSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get('amount')
    user = request.user

    if not amount or float(amount) <= 0:
        return Response({'error': 'Invalid deposit amount'}, status=400)

    transaction = Transaction.objects.create(
        user=user,
        type="Deposit",
        amount=amount
    )
    serializer = TransactionSerializer(transaction)
    return Response(serializer.data)

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
        "detail": f"Withdrawal successful: {transaction.amount} KSH",
        "transaction": serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_transactions(request):
    transactions = Transaction.objects.filter(user=request.user).order_by('-date')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_statement(request, user_id):
    transactions = Transaction.objects.filter(user_id=user_id).order_by("-date")
    data = [
        {
            "date": t.date,
            "amount": t.amount,
            "type": t.type,
            "description": t.description,
        }
        for t in transactions
    ]
    return Response({"user_id": user_id, "transactions": data})