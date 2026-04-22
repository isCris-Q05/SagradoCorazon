from django.contrib import admin
from .models import Alergia, Enfermedad, PacienteAlergia, Registro, Tratamiento, TratamientoEnfermedad, RegistroTratamiento

admin.site.register(Alergia)
admin.site.register(Enfermedad)
admin.site.register(PacienteAlergia)
admin.site.register(Registro)
admin.site.register(Tratamiento)
admin.site.register(TratamientoEnfermedad)
admin.site.register(RegistroTratamiento)
