from django.contrib import admin
from django.urls import path, include
from accounts import views
from accounts.views import custom_login, dashboard_data, debug_headers
from loans.views import repayments_by_user, transactions_report, repayments_by_user_api

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication & dashboard
    path('api/login/', custom_login, name='custom_login'),
    path('api/dashboard/data/', dashboard_data, name='dashboard_data'),
    path('api/debug/headers/', debug_headers, name='debug_headers'),

    # App routes
    path('api/accounts/', include('accounts.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/loans/', include('loans.urls')),
    path('api/', include('users.urls')),
    path("admin/reports/transactions/", transactions_report, name="transactions_report"),
    path("admin/reports/repayments-by-user/", repayments_by_user, name="repayments_by_user"),
    path("api/admin/repayments-by-user/", repayments_by_user_api, name="repayments_by_user_api"),
]
