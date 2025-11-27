from django.urls import path
from .views import (
    login_view,
    register_view,
    dashboard_view,
    password_reset_request,
    password_reset_confirm,
)

urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/register/", register_view, name="register"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("password-reset/", password_reset_request, name="password_reset"),
    path("password-reset-confirm/<str:token>/", password_reset_confirm, name="password_reset_confirm"),
]