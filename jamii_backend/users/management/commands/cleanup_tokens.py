# users/management/commands/cleanup_tokens.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import PasswordResetToken   # ✅ updated import

class Command(BaseCommand):
    help = "Delete expired password reset tokens"

    def handle(self, *args, **kwargs):
        count, _ = PasswordResetToken.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {count} expired tokens"))