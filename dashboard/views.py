from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

def dashboard_home(request):
    return HttpResponse("Dashboard app is working!")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_staff': user.is_staff,
    })