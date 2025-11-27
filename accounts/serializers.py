from rest_framework import serializers
from .models import Account, Transaction

class TransactionSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(source='account.account_number', read_only=True)
    username = serializers.CharField(source='account.user.username', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'account', 'account_number', 'username', 'timestamp', 'amount', 'type']

class AccountSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, source='transaction_set', read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'user', 'account_number', 'balance', 'account_type', 'created_at', 'transactions']