from django.urls import include, path
from . import views
from .views import dashboard_data


urlpatterns = [
    path('', views.dashboard_home, name='dashboard_home'),
    path('dashboard/data/', dashboard_data),
]
