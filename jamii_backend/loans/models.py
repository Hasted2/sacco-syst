from time import timezone
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Loan(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
        ("Repaid", "Repaid"),
        ("Revoked", "Revoked"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    reason = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.status}"
    
class LoanRepayment(models.Model):
    loan = models.ForeignKey(Loan, related_name="repayments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} repaid {self.amount} for loan {self.loan.id}"
