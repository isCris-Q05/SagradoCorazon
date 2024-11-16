from django.urls import path
from .views import index,registrar_paciente, registrar_medico, login_medico, dashboard_medico
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', index, name='index'),
    path('registrar/paciente/', registrar_paciente, name='registrar_paciente'),
    path('registrar/medico/', registrar_medico, name='registrar_medico'),
    path('login/medico/', login_medico, name='login_medico'),
    path('dashboard/medico/', dashboard_medico, name='dashboard_medico'),

    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]