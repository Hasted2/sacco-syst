from django.db import models
from django.contrib.auth.models import User
import uuid
from time import timezone
from django.utils import timezone
from datetime import timedelta

def default_expiry():
    return timezone.now() + timedelta(hours=24)
def is_expired(self):
        """Check if this reset token has expired."""
        return timezone.now() > self.expires_at

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4().hex)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(default=default_expiry)

    def is_valid(self):
        return timezone.now() < self.expires_at

    def __str__(self):
        return f"Password reset token for {self.user.username}"
    
    def __str__(self):
        return f"Token for {self.user.username} (expires {self.expires_at})"

# Create your models here.
