from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import RepaymentSchedule
from transactions.serializers import RepaymentScheduleSerializer

@api_view(['GET'])
def view_schedule(request):
    loan_id = request.GET.get('loan_id')
    schedule = RepaymentSchedule.objects.filter(loan_id=loan_id).order_by('due_date')
    serializer = RepaymentScheduleSerializer(schedule, many=True)
    return Response(serializer.data)