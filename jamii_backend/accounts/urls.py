from django.urls import path
from accounts import views
from .deposit import deposit
from .withdraw import withdraw
from .views import account_balance, account_transactions

urlpatterns = [
    path("dashboard/data/", views.dashboard_data, name="dashboard_data"),
    path("debug/headers/", views.debug_headers, name="debug_headers"),
    path("login/", views.custom_login, name="custom_login"),
    path("balance/", account_balance, name="account_balance"),
    path("deposit/", deposit),
    path("withdraw/", withdraw),
    path("transactions/", account_transactions, name="account_transactions"),
    path("list/", views.list_accounts, name="list_accounts"),
]