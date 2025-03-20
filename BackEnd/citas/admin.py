from django.contrib import admin
from .models import Usuario, Paciente, Medico, Alergia, Cita, Enfermedad, Especialidad, MedicoEspecialidad, PacienteAlergia, Producto, Registro, RegistroProducto, Tratamiento, TratamientoEnfermedad, RegistroTratamiento
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Paciente)
admin.site.register(Medico)
admin.site.register(Alergia)
admin.site.register(Cita)
admin.site.register(Enfermedad)
admin.site.register(Especialidad)
admin.site.register(MedicoEspecialidad)
admin.site.register(PacienteAlergia)
admin.site.register(Producto)
admin.site.register(Registro)
admin.site.register(RegistroProducto)
admin.site.register(Tratamiento)
admin.site.register(TratamientoEnfermedad)
admin.site.register(RegistroTratamiento)