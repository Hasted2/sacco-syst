# transactions/urls.py
from django.urls import path
from .views import deposit, withdraw, list_transactions, user_statement
from . import views

urlpatterns = [
    path('deposit/', deposit, name='deposit'),
    path('withdraw/', withdraw, name='withdraw'),
    path('list/', list_transactions, name='list_transactions'),
    path("statement/<int:user_id>/", views.user_statement, name="user_statement"),
]