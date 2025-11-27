from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Account, Transaction
from accounts.models import Account
from accounts.serializers import AccountSerializer
from accounts.models import Transaction
from accounts.serializers import TransactionSerializer
from decimal import Decimal

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user is not None:
        # Ensure user has at least one account
        if not Account.objects.filter(user=user, account_type="SAVINGS").exists():
            Account.objects.create(
                user=user,
                account_number=f"ACC{user.id:03d}",
                account_type="SAVINGS",
                balance=0.00
            )

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    user = request.user
    return Response({
        "username": user.username,
        "is_staff": user.is_staff,
        "dashboard_message": "Welcome back, Teddy!"
    })

@api_view(['GET'])
def debug_headers(request):
    return Response(dict(request.headers))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get("amount")
    account_number = request.data.get("account_number")
    user = request.user

    if not amount or float(amount) <= 0:
        return Response({"detail": "Invalid deposit amount"}, status=400)

    try:
        account = Account.objects.get(user=user, account_number=account_number)
    except Account.DoesNotExist:
        return Response({"detail": "Account not found"}, status=404)

    account.balance += float(amount)
    account.save()

    Transaction.objects.create(account=account, amount=amount, type="deposit")

    return Response({
        "detail": f"Deposit successful! New balance: {account.balance} KSH",
        "account": {"account_number": account.account_number, "balance": account.balance}
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def withdraw(request):
    amount = request.data.get("amount")
    account_number = request.data.get("account_number")
    user = request.user

    if not amount or float(amount) <= 0:
        return Response({"detail": "Invalid withdrawal amount"}, status=400)

    try:
        account = Account.objects.get(user=user, account_number=account_number)
    except Account.DoesNotExist:
        return Response({"detail": "Account not found"}, status=404)

    if account.balance < float(amount):
        return Response({"detail": "Insufficient funds"}, status=400)

    account.balance -= float(amount)
    account.save()

    Transaction.objects.create(account=account, amount=amount, type="withdrawal")

    return Response({
        "detail": f"Withdrawal successful! New balance: {account.balance} KSH",
        "account": {"account_number": account.account_number, "balance": account.balance}
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_balance(request):
    user = request.user
    try:
        account = Account.objects.filter(user=user).first()
        if not account:
            return Response({'error': 'No account found'}, status=404)
        serializer = AccountSerializer(account)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    try:
        account = Account.objects.get(user=request.user, account_type="SAVINGS")
    except Account.DoesNotExist:
        return Response({"message": request.user.username, "balance": 0})

    return Response({
        "message": f"{request.user.username}",
        "balance": account.balance
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_transactions(request):
    user = request.user
    # Get all transactions for this user's accounts
    transactions = Transaction.objects.filter(account__user=user).order_by('-timestamp')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_accounts(request):
    accounts = Account.objects.filter(user=request.user)
    serializer = AccountSerializer(accounts, many=True)
    return Response(serializer.data)
