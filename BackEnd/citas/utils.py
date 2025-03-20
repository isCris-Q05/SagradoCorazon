from django.http import HttpResponseForbidden
from functools import wraps
from django.contrib import messages
from django.shortcuts import redirect
from .models import Medico

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
