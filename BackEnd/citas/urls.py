from django.urls import path
from .views import index,registrar_paciente, registrar_medico, login_medico, login_paciente ,dashboard_medico, dashboard_paciente, logout_user, crear_alergia
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', index, name='index'),

    path('login/medico/', login_medico, name='login_medico'),
    path('login/paciente/', login_paciente, name='login_paciente'),
    path('logout/', logout_user, name='logout'),

    path('registrar/paciente/', registrar_paciente, name='registrar_paciente'),
    path('registrar/medico/', registrar_medico, name='registrar_medico'),

    path('dashboard/medico/', dashboard_medico, name='dashboard_medico'),
    path('dashboard/paciente/', dashboard_paciente, name='dashboard_paciente'),

    path('crear/alergia/', crear_alergia, name='crear_alergia'),

]