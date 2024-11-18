from django.urls import path
from .views import index,registrar_paciente, registrar_medico, login_medico, login_paciente ,dashboard_medico, dashboard_paciente, logout_user, crear_alergia, crear_especialidad, asignar_especialidad, listar_medicos, detalle_medico, listar_enfermedades, crear_enfermedad, listar_tratamientos, crear_tratamiento, asignar_tratamiento, listar_enfermedades_tratamientos, agregar_producto, listar_productos, crear_cita, listar_citas
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
    path('crear/especialidad/', crear_especialidad, name='crear_especialidad'),

    
    path('medicos/', listar_medicos, name='listar_medicos'),
    path('medicos/<int:medico_id>/', detalle_medico, name='detalle_medico'),
    path('medicos/<int:medico_id>/asignar-especialidad/', asignar_especialidad, name='asignar_especialidad'),

    path('enfermedades/', listar_enfermedades, name='listar_enfermedades'),
    path('enfermedades/nuevo/', crear_enfermedad, name='crear_enfermedad'),
    path('tratamientos/', listar_tratamientos, name='listar_tratamientos'),
    path('tratamientos/nuevo/', crear_tratamiento, name='crear_tratamiento'),
    path('tratamientos/asignar/', asignar_tratamiento, name='asignar_tratamiento'),

    path('enfermedades-tratamientos/', listar_enfermedades_tratamientos, name='listar_enfermedades_tratamientos'),

    path('agregar-producto/', agregar_producto, name='agregar_producto'),
    path('productos/', listar_productos, name='listar_productos'),

    path('crear/cita/', crear_cita, name='crear_cita'),
    path('citas/', listar_citas, name='listar_citas'),
]