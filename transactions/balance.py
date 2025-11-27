from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts import models
from transactions.models import Transfer
from django.contrib.auth.models import User

@api_view(['GET'])
def balance(request):
    user_id = request.GET.get('user_id')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    total = Transfer.objects.filter(user=user).aggregate(balance=models.Sum('amount'))['balance'] or 0
    return Response({'user': user.username, 'balance': total})