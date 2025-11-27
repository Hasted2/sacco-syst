from django.urls import path
from .views import apply_loan, list_loans, list_repayments, list_all_loans, approve_loan, create_repayment, reject_loan, revoke_loan, list_unpaid_loans

urlpatterns = [
    path('apply/', apply_loan, name='apply_loan'),
    path('list/', list_loans, name='list_loans'),
    path('repayments/<int:loan_id>/', list_repayments, name='list_repayments'),
    path('all/', list_all_loans, name='list_all_loans'),
    path('approve/<int:loan_id>/', approve_loan, name='approve_loan'),
    path('repay/<int:loan_id>/', create_repayment, name='create_repayment'),
    path('reject/<int:loan_id>/', reject_loan, name='reject_loan'),
    path('revoke/<int:loan_id>/', revoke_loan, name='revoke_loan'),
    path("unpaid/", list_unpaid_loans, name="list_unpaid_loans"),
]