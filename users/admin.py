from django.contrib import admin
from .models import PasswordResetToken
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import Profile

# Custom form for adding users in Admin
class CustomUserCreationForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    national_id = forms.CharField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.set_password(self.cleaned_data["password"])  # ensure password is hashed
            user.save()
            Profile.objects.create(
                user=user,
                national_id=self.cleaned_data["national_id"]
            )
        return user

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"

class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    add_form = CustomUserCreationForm
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "get_national_id")

    def get_national_id(self, obj):
        return obj.profile.national_id if hasattr(obj, "profile") else "-"
    get_national_id.short_description = "National ID"

# Unregister the default User admin
admin.site.unregister(User)
# Register our custom one
admin.site.register(User, CustomUserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "national_id")
    search_fields = ("national_id", "user__username", "user__first_name", "user__last_name")

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "created_at", "expires_at", "is_expired")
    search_fields = ("user__username", "token")
    list_filter = ("created_at", "expires_at")

    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True   # ✅ shows as a green/red icon in admin