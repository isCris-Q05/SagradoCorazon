from django.urls import path
from .views import index,registrar_paciente, registrar_medico

urlpatterns = [
    path('', index, name='index'),
    path('registrar/paciente/', registrar_paciente, name='registrar_paciente'),
    path('registrar/medico/', registrar_medico, name='registrar_medico'),
]