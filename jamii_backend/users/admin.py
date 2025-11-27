from django.contrib import admin
from .models import PasswordResetToken

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "created_at", "expires_at", "is_expired")
    search_fields = ("user__username", "token")
    list_filter = ("created_at", "expires_at")

    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True   # ✅ shows as a green/red icon in admin