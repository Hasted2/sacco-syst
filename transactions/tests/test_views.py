from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from transactions.models import Transfer, Loan

class TransactionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='teddy', password='sacco123')
        self.client.force_authenticate(user=self.user)

    def test_deposit(self):
        response = self.client.post('/transactions/deposit/', {
            'user_id': self.user.id,
            'amount': 1000,
            'description': 'Test deposit'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], '1000.00')

    def test_withdraw(self):
        response = self.client.post('/transactions/withdraw/', {
            'user_id': self.user.id,
            'amount': 500,
            'description': 'Test withdrawal'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], '-500.00')

    def test_balance(self):
        Transfer.objects.create(user=self.user, amount=1000)
        Transfer.objects.create(user=self.user, amount=-500)
        response = self.client.get(f'/transactions/balance/?user_id={self.user.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['balance'], 500.00)