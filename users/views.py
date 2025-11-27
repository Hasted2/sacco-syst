from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from datetime import timedelta
import uuid
from .models import PasswordResetToken, Profile
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

# -------------------
# DASHBOARD (Protected)
# -------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    return Response({"message": f"Welcome {request.user.username}, this is your dashboard!"})


# -------------------
# LOGIN
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    logger.info("Login payload: %s", request.data)

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
        })

    return Response({"detail": "Invalid credentials."}, status=401)


# -------------------
# REGISTER
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    national_id = request.data.get("national_id")

    # Validate required fields
    if not all([username, email, password, first_name, last_name, national_id]):
        return Response({"detail": "All fields are required."}, status=400)

    # Check uniqueness
    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already taken."}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"detail": "Email already registered."}, status=400)
    if Profile.objects.filter(national_id=national_id).exists():
        return Response({"detail": "National ID already registered."}, status=400)

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    # ✅ Safe profile creation
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={"national_id": national_id}
    )

    # If a profile already existed (created=False), update national_id
    if not created:
        profile.national_id = national_id
        profile.save()

    return Response({
        "detail": "Registration successful.",
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "national_id": profile.national_id,
    }, status=201)


# -------------------
# PASSWORD RESET REQUEST
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get("email")

    # Find all users with this email
    users = User.objects.filter(email=email)

    if not users.exists():
        return Response({"detail": "No user with that email."}, status=404)

    # ✅ Option 2: if multiple users share the same email, just pick the first one
    user = users.first()

    # Generate reset token
    token = str(uuid.uuid4())
    PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=1),
        is_used=False
    )

    # Build reset link (frontend route)
    reset_link = f"http://localhost:3000/password-reset-confirm/{token}"

    # TODO: send reset_link via email (currently just returned in response)
    return Response({
        "detail": "Reset link sent.",
        "reset_link": reset_link,
        "username": user.username,
        "email": user.email,
    }, status=200)


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


# -------------------
# RESET PASSWORD (direct token)
# -------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token_string = request.data.get("token")
    new_password = request.data.get("new_password")

    try:
        token = PasswordResetToken.objects.get(token=token_string)
    except PasswordResetToken.DoesNotExist:
        return Response({"error": "Invalid token."}, status=400)

    if token.is_expired():
        return Response({"error": "This password reset link has expired."}, status=400)

    user = token.user
    user.set_password(new_password)
    user.save()

    token.delete()

    return Response({"detail": "Password reset successful."})

# users/views.py or transactions/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from transactions.models import Transaction  # adjust to your model

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_statement(request, user_id):
    transactions = Transaction.objects.filter(user_id=user_id).order_by("-date")
    data = [
        {
            "date": t.date,
            "amount": t.amount,
            "type": t.type,
            "description": t.description,
        }
        for t in transactions
    ]
    return Response({"user_id": user_id, "transactions": data})
