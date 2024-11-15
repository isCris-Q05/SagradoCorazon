from django.urls import path
from .views import index, buscar, registrar_usuario

urlpatterns = [
    path('', index, name='index'),
    path('buscar/', buscar, name='buscar'),
    path('registrar/', registrar_usuario, name='registrar'),
]