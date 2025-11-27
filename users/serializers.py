# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class RegisterSerializer(serializers.ModelSerializer):
    national_id = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "national_id"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_national_id(self, value):
        if Profile.objects.filter(national_id=value).exists():
            raise serializers.ValidationError("This national ID is already registered.")
        return value

    def create(self, validated_data):
        national_id = validated_data.pop("national_id")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        Profile.objects.create(user=user, national_id=national_id)
        return user

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        national_id = request.data.get("national_id")

        user = authenticate(username=username, password=password)

        if user and hasattr(user, "profile") and user.profile.national_id == national_id:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "is_staff": user.is_staff})
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

