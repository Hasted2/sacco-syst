from rest_framework import serializers
from .models import Loan, LoanRepayment

class LoanSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    account_balance = serializers.DecimalField(
        source="user.account.balance", max_digits=12, decimal_places=2, read_only=True
    )
    original_amount = serializers.SerializerMethodField()  # ✅ new field

    class Meta:
        model = Loan
        fields = [
            "id",
            "date",
            "amount",          # current remaining balance
            "status",
            "reason",
            "user_name",
            "user_id",
            "account_balance",
            "original_amount", # total loan amount when approved
        ]

    def get_original_amount(self, obj):
        # Calculate original amount = current remaining + total repaid
        total_repaid = sum(r.amount for r in obj.repayments.all())
        return obj.amount + total_repaid


class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = ["id", "date", "amount", "loan"]