from django.urls import path
from .views import index,registrar_paciente

urlpatterns = [
    path('', index, name='index'),
    path('registrar/paciente/', registrar_paciente, name='registrar_paciente'),
]