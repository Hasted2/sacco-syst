from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import RepaymentSchedule
from django.utils import timezone
from datetime import timedelta
from transactions.utils import admin_required


def send_sms(phone_number, message):
    print(f"SMS to {phone_number}: {message}")  # Replace with Twilio later

def send_email(email, subject, message):
    print(f"Email to {email}: {subject} - {message}")  # Replace with SendGrid later

@api_view(['POST'])
@admin_required
def send_due_alerts(request):
    today = timezone.now().date()
    upcoming = RepaymentSchedule.objects.filter(
        due_date=today + timedelta(days=1),
        is_paid=False
    ).select_related('loan', 'loan__user')

    for schedule in upcoming:
        user = schedule.loan.user
        message = f"Reminder: You owe {schedule.amount_due} on {schedule.due_date} for loan #{schedule.loan.id}"
        send_sms(user.username, message)  # Replace with phone number
        send_email(user.email, "Loan Repayment Due", message)

    return Response({'message': 'Alerts sent'})