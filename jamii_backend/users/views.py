from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from datetime import timedelta
import uuid
from .models import PasswordResetToken

User = get_user_model()

# -------------------
# DASHBOARD (Protected)
# -------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    return Response({"message": f"Welcome {request.user.username}, this is your dashboard!"})


# -------------------
# LOGIN (JWT)
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "is_staff": user.is_staff,
        })
    return Response({"detail": "Invalid credentials"}, status=400)


# -------------------
# REGISTER
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"detail": "All fields are required."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already taken."}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "Email already registered."}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"detail": "Registration successful.", "username": user.username})


# -------------------
# PASSWORD RESET REQUEST
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "No user with that email."}, status=404)

    token = str(uuid.uuid4())
    reset_token = PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=1),
        is_used=False
    )

    reset_link = f"http://localhost:3000/password-reset-confirm/{token}"
    # TODO: send reset_link via email
    return Response({"detail": "Reset link sent.", "reset_link": reset_link})


# -------------------
# PASSWORD RESET CONFIRM
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, token):
    new_password = request.data.get("password")
    try:
        reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
    except PasswordResetToken.DoesNotExist:
        return Response({"detail": "Invalid or expired token."}, status=400)

    if not reset_token.is_valid():
        return Response({"detail": "Token expired."}, status=400)

    user = reset_token.user
    user.password = make_password(new_password)
    user.save()

    reset_token.is_used = True
    reset_token.save()

    return Response({"detail": "Password reset successful."})

@api_view(['POST'])
def reset_password(request):
    token_string = request.data.get("token")
    new_password = request.data.get("new_password")

    try:
        token = PasswordResetToken.objects.get(token=token_string)
    except PasswordResetToken.DoesNotExist:
        return Response({"error": "Invalid token."}, status=400)

    # ✅ Check if expired
    if token.is_expired():
        return Response({"error": "This password reset link has expired."}, status=400)

    # If valid, reset password
    user = token.user
    user.set_password(new_password)
    user.save()

    # Optionally delete the token after use
    token.delete()

    return Response({"detail": "Password reset successful."})
