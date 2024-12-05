from django.urls import path
from .views import index,registrar_paciente, registrar_medico, login_medico, login_paciente ,dashboard_medico, dashboard_paciente, logout_user, crear_alergia, crear_especialidad, asignar_especialidad, listar_medicos, detalle_medico, listar_enfermedades_alergias, crear_enfermedad, listar_tratamientos, crear_tratamiento, asignar_tratamiento, listar_enfermedades_tratamientos, agregar_producto, listar_productos, crear_cita, listar_citas
from .views import login_usuario, register, inicio, listar_alergias, buscar_medicos, buscar_pacientes, obtener_especialidades, buscar_cita, crear_registro, buscar_enfermedades, tratamientos_por_enfermedad, paciente_citas,paciente_historial,paciente_inicio, editar_cita,registrar_paciente
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', inicio, name='inicio'),

    path('login/', login_usuario, name='login'),
    path('register/', register, name='register'),

    #registrar paciente
    path('registrar_paciente/',registrar_paciente,name="registrar_paciente"),

    #urls vistas paciente
    path('paciente_inicio/',paciente_inicio,name='inicio_pacientes'),
    path('paciente_citas/',paciente_citas,name='mis_citas'),
    path('paciente_historial',paciente_historial,name='historial_medico'),

    path('login/medico/', login_medico, name='login_medico'),
    path('login/paciente/', login_paciente, name='login_paciente'),
    path('logout/', logout_user, name='logout'),

    path('registrar/paciente/', registrar_paciente, name='registrar_paciente'),
    path('registrar/medico/', registrar_medico, name='registrar_medico'),

    path('dashboard/medico/', dashboard_medico, name='dashboard_medico'),
    path('dashboard/paciente/', dashboard_paciente, name='dashboard_paciente'),

    path('crear/alergia/', crear_alergia, name='crear_alergia'),
    path('listar/alergias/', listar_alergias, name='alergias'),
    path('crear/especialidad/', crear_especialidad, name='crear_especialidad'),

    
    path('medicos/', listar_medicos, name='doctores'),
    path('medicos/<int:medico_id>/', detalle_medico, name='detalle_medico'),
    path('medicos/<int:medico_id>/asignar-especialidad/', asignar_especialidad, name='asignar_especialidad'),

    path('enfermedades_alergias/', listar_enfermedades_alergias, name='enfermedades_alergias'),
    path('enfermedades/nuevo/', crear_enfermedad, name='crear_enfermedad'),
    path('tratamientos/', listar_tratamientos, name='tratamientos'),
    path('tratamientos/nuevo/', crear_tratamiento, name='crear_tratamiento'),
    path('tratamientos/asignar/', asignar_tratamiento, name='asignar_tratamiento'),

    path('enfermedades-tratamientos/', listar_enfermedades_tratamientos, name='listar_enfermedades_tratamientos'),

    path('agregar-producto/', agregar_producto, name='agregar_producto'),
    path('productos/', listar_productos, name='productos'),

    path('crear/cita/', crear_cita, name='crear_cita'),
    path('citas/', listar_citas, name='listar_citas'),
    path('citas/editar/', editar_cita, name='editar_cita'),

    path('buscar_pacientes/', buscar_pacientes, name='buscar_pacientes'),
    path('buscar_medicos/', buscar_medicos, name='buscar_medicos'),
    path('buscar_cita/', buscar_cita, name='buscar_cita'),

    path('buscar-enfermedades/', buscar_enfermedades, name='buscar_enfermedades'),

    path('crear/registro/', crear_registro, name='crear_registro'),

    path('tratamientos-por-enfermedad/', tratamientos_por_enfermedad, name='tratamientos_por_enfermedad'),

    path('obtener_especialidades/', obtener_especialidades, name='obtener_especialidades'),
]