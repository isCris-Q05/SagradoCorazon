from django.http import HttpResponseForbidden
from functools import wraps
from django.contrib import messages
from django.shortcuts import redirect
from .models import Medico

# Single Responsibility Principle: esta función se encarga únicamente de la autorización de acceso
# a vistas de médicos administradores. Se mantiene separada del código de las vistas, evitando que
# estas tengan lógica de permisos mezclada con la lógica de negocio.
# Dependency Inversion Principle: la vista recibe la lógica de autorización como una abstracción
# (decorador), sin depender directamente de los detalles de implementación de la verificación.
def admin_medico_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Debes iniciar sesión para acceder.")
            return redirect('login')  # Cambia 'login' al nombre correcto de tu vista de inicio de sesión
        try:
            medico = request.user.medico_profile
            if not medico.es_admin:
                messages.warning(request, "No tienes permiso para acceder.")
                return redirect('error')  # Cambia 'vista_error' al nombre de tu vista para la página de error
        except Medico.DoesNotExist:
            messages.warning(request, "No tienes permiso para acceder.")
            return redirect('error')
        return view_func(request, *args, **kwargs)
    return _wrapped_view
