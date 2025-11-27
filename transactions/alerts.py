from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import RepaymentSchedule
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def upcoming_alerts(request):
    today = timezone.now().date()
    next_week = today + timedelta(days=7)

    alerts = RepaymentSchedule.objects.filter(
        due_date__range=(today, next_week),
        is_paid=False
    ).select_related('loan', 'loan__user')

    data = [
        {
            'user': schedule.loan.user.username,
            'loan_id': schedule.loan.id,
            'due_date': schedule.due_date,
            'amount_due': schedule.amount_due
        }
        for schedule in alerts
    ]

    return Response(data)