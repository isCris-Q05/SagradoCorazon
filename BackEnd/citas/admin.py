from django.contrib import admin
from .models import Usuario, Paciente, Medico
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Paciente)
admin.site.register(Medico)