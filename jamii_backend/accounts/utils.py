import random
from accounts.models import Account

def generate_account_number():
    while True:
        # Example: 10‑digit random number
        account_number = str(random.randint(1000000000, 9999999999))
        if not Account.objects.filter(account_number=account_number).exists():
            return account_number
