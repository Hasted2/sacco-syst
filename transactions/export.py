import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view
from transactions.models import Transfer
from transactions.utils import admin_required


@api_view(['GET'])
@admin_required
def export_transfers_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transfers.csv"'

    writer = csv.writer(response)
    writer.writerow(['User', 'Amount', 'Description', 'Timestamp'])

    for transfer in Transfer.objects.all().order_by('-timestamp'):
        writer.writerow([
            transfer.user.username,
            transfer.amount,
            transfer.description,
            transfer.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        ])

    return response