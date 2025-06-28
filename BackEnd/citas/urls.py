from django.urls import path
from .views import index,registrar_paciente, registrar_medico, login_medico, login_paciente ,dashboard_medico, dashboard_paciente, logout_user, crear_alergia, crear_especialidad, asignar_especialidad, listar_medicos, detalle_medico, listar_enfermedades_alergias, crear_enfermedad, listar_tratamientos, crear_tratamiento, asignar_tratamiento, listar_enfermedades_tratamientos, agregar_producto, listar_productos, crear_cita, listar_citas
from .views import login_usuario, register, inicio, listar_alergias, buscar_medicos, buscar_pacientes, obtener_especialidades, buscar_cita, crear_registro, buscar_enfermedades, tratamientos_por_enfermedad, paciente_citas,paciente_historial,paciente_inicio, editar_cita,registrar_paciente, vista_error, forgot_password_medico, validate_otp, change_password, validar_disponibilidad_medico

from .views import send_reminder, todas_las_citas_json, generar_reporte, historial_paciente, tipo_citas_all, cantidad_total_citas, visualizacion, citas_asistio, citas_no_asistio, citas_pendientes, filtro_enfermedades, filtrar_registros_tratamientos, citas_visualizacion, doctores_all, enfermedades_cantidad_pacientes, buscar_enfermedades, buscar_pacientes2, buscar_enfermedades, datos_tendencias_enfermedades, estadisticas_tratamientos, enfermedades_por_tratamiento

from .views import tendencias_tratamientos, backup_db, tendencias_generales_enfermedades

from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', inicio, name='inicio'),
    path('api/citas/', todas_las_citas_json, name='todas_las_citas_json'),
    path('reporte/', generar_reporte, name='generar_reporte'),

    path('historial_paciente/<str:username>/', historial_paciente, name='historial_paciente'),
    path('tipo_citas/<str:tipo>/', tipo_citas_all, name='tipo_citas'),
    path('cantidad_total_citas/', cantidad_total_citas, name='cantidad_total_citas'),
    path('visualizacion/', visualizacion, name='visualizacion'),
    
    path('citas_asistio/', citas_asistio, name='citas_asistio'),
    path('citas_asistio/<str:fecha_inicio>/<str:fecha_fin>/', citas_asistio, name='citas_asistio_rango'),

    path('citas_no_asistio/', citas_no_asistio, name='citas_no_asistio'),
    path('citas_no_asistio/<str:fecha_inicio>/<str:fecha_fin>/', citas_no_asistio, name='citas_no_asistio_rango'),

    path('citas_pendientes/', citas_pendientes, name='citas_pendientes'),
    path('citas_pendientes/<str:fecha_inicio>/<str:fecha_fin>/', citas_pendientes, name='citas_pendientes_rango'),

    path('filtro_enfermedades/', filtro_enfermedades, name='filtro_enfermedades'),

    path('filtrar_registros_tratamientos/', filtrar_registros_tratamientos, name='filtrar_registros_tratamientos'),

    path('citas_visualizacion/', citas_visualizacion, name='citas_visualizacion'),

    path('doctores_all/', doctores_all, name='doctores_all'),

    path('enfermedades_cantidad_pacientes/', enfermedades_cantidad_pacientes, name='enfermedades_cantidad_pacientes'),

    path('buscar-pacientes2/', buscar_pacientes2, name='buscar_pacientes2'),

    path('datos_tendencias_enfermedades/', datos_tendencias_enfermedades, name='datos_tendencias_enfermedades'),

    path('estadisticas-tratamientos/', estadisticas_tratamientos, name='estadisticas_tratamientos'),

    path('enfermedades-por-tratamiento/', enfermedades_por_tratamiento, name='enfermedades_por_tratamiento'),

    path('tendencias-tratamientos/', tendencias_tratamientos, name='tendencias_tratamientos'),

    path('backup/', backup_db, name='backup_db'),


    path('login/', login_usuario, name='login'),
    path('register/', register, name='register'),

    path('error/', vista_error, name='error'),

    #registrar paciente
    path('registrar_paciente/',registrar_paciente,name="registrar_pacientes"),

    #urls vistas paciente
    path('paciente_inicio/',paciente_inicio,name='inicio_pacientes'),
    path('paciente_citas/',paciente_citas,name='mis_citas'),
    path('paciente_historial',paciente_historial,name='historial_medico'),

    path('login/medico/', login_medico, name='login_medico'),
    path('login/paciente/', login_paciente, name='login_paciente'),
    path('logout/', logout_user, name='logout'),
    path('forgot-password-med/', forgot_password_medico, name='forgot_password_med'),
    path('validate-otp/', validate_otp, name='validate_otp'),
    path('change-password/', change_password, name='change_password'),
    path('send-reminder/', send_reminder, name='send_reminder'),


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
    path('validar-disponibilidad/', validar_disponibilidad_medico, name='validar_disponibilidad'),


    path('buscar_pacientes/', buscar_pacientes, name='buscar_pacientes'),
    path('buscar_medicos/', buscar_medicos, name='buscar_medicos'),
    path('buscar_cita/', buscar_cita, name='buscar_cita'),

    path('buscar-enfermedades/', buscar_enfermedades, name='buscar_enfermedades'),

    path('crear/registro/', crear_registro, name='crear_registro'),

    path('tratamientos-por-enfermedad/', tratamientos_por_enfermedad, name='tratamientos_por_enfermedad'),

    path('obtener_especialidades/', obtener_especialidades, name='obtener_especialidades'),

    path("tendencias_generales_enfermedades/", tendencias_generales_enfermedades, name="tendencias_generales_enfermedades"),
]