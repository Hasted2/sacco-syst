from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from accounts.models import Account
from accounts.utils import generate_account_number

@receiver(post_save, sender=User)
def create_account_for_new_user(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(
            user=instance,
            account_number=generate_account_number(),
            balance=0  # start with zero balance
        )