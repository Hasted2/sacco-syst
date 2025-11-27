from rest_framework.response import Response
from functools import wraps
from transactions.models import UserProfile

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.role != 'admin':
                return Response({'error': 'Admin access required'}, status=403)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=403)
        return view_func(request, *args, **kwargs)
    return _wrapped_view