from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Usuario, Paciente, Medico, Alergia, Especialidad, MedicoEspecialidad, Enfermedad, Tratamiento,TratamientoEnfermedad, Producto, Cita, Registro, RegistroTratamiento, RegistroProducto
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.timezone import now
from citas.utils import admin_medico_required
import pywhatkit as kit
from django.views.decorators.csrf import csrf_exempt

from django.conf import settings
from twilio.rest import Client


# Create your views here.
def index(request):
    return render(request, "citas/index.html")


def paciente_inicio(request):
    return render(request,'citas2/vista_pacientes/inicio.html')

def paciente_citas(request):
    paciente_id = 5

    proximas_citas = Cita.objects.filter(fecha__gte=now(), id_paciente=paciente_id).order_by('fecha')
    citas_pasadas = Cita.objects.filter(fecha__lt=now(), id_paciente=paciente_id).order_by('-fecha')

    return render(request, 'citas2/vista_pacientes/MisCitas.html', {
        'proximas_citas': proximas_citas,
        'citas_pasadas': citas_pasadas
    })

def paciente_historial(request):
    return render(request,'citas2/vista_pacientes/HistorialMedico.html')


# registrar pacientes
def registrar_paciente(request):
    pacientes = Paciente.objects.all()

    if request.method == "POST":
        username = request.POST.get('nombrePaciente')
        nombre = request.POST.get('nombrePaciente')
        apellido = request.POST.get('apellidoPaciente')
        fecha_nacimiento = request.POST.get('fechaNacimientoPaciente')
        cedula = request.POST.get('cedulaPaciente')
        genero = request.POST.get('generoPaciente')
        telefono = request.POST.get('telefonoPaciente')
        email = request.POST.get('emailPaciente')
        direccion = request.POST.get('direccionPaciente')
        motivo = request.POST.get('motivoConsulta')
        enfermedades = request.POST.getlist('enfermedades')  # Recoger enfermedades como lista
        alergias = request.POST.getlist('alergias')  # Recoger alergias como lista
        contacto_emergencia = request.POST.get('contactoEmergencia')
        telefono_emergencia = request.POST.get('telefonoEmergencia')

        print(f"user: {username}")
        #return HttpResponse("pacientte creado")
        
         # Crear un usuario si es necesario (ejemplo: se puede tener un usuario para el paciente)
        usuario = Usuario.objects.create(
            username = username,
            first_name=nombre,
            last_name=apellido,
            email=email
        )
        
        # Crear el paciente
        paciente = Paciente.objects.create(
            user=usuario,
            genero=genero,
            direccion=direccion,
            motivo=motivo,
            cedula=cedula,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento,
            enfermedadess=enfermedades,
            alergiass=alergias,
            contacto_emergencias=contacto_emergencia,
            telefono_emergencia=telefono_emergencia,
            apellido=apellido
        )

        messages.success(request, 'El paciente se ha registrado correctamente.')
        return redirect('inicio')
    return render(request,"citas2/pacientes.html",{'pacientes':pacientes})

@admin_medico_required    
def registrar_medico(request):
    if request.method == "POST":
        # Datos del usuario
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password', '')  # Solo una contraseña
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        role = 'Medico'
        genero = request.POST.get('genero', '')

        # Datos del médico
        telefono = request.POST.get('telefono', '')
        is_admin = request.POST.get('is_admin', 'False') == 'True'

        print(f"is_admin: {is_admin}")

        print(f"username: {username}")
        print(f"email: {email}")
        print(f"password: {password}")
        print(f"first_name: {first_name}")
        print(f"last_name: {last_name}")
        print(f"role: {role}")
        print(f"genero: {genero}")
        print(f"telefono: {telefono}")

        #return HttpResponse("adadhadhad creado")

        # Validaciones
        if Usuario.objects.filter(username=username).exists():
            messages.error(request, 'El nombre de usuario ya está registrado.')
            return redirect('doctores')

        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'El correo electrónico ya está registrado.')
            return redirect('doctores')

        # Crear el usuario
        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
            genero=genero
        )

        # Crear el médico
        medico = Medico.objects.create(
            user=user,
            telefono=telefono,
            es_admin=is_admin  # Asignar el valor de is_admin
        )

        # Guardar especialidades
        especialidades_ids = request.POST.getlist('especialidades')
        for especialidad_id in especialidades_ids:
            especialidad = Especialidad.objects.get(id_especialidad=especialidad_id)
            MedicoEspecialidad.objects.create(
                id_medico=medico,
                id_especialidad=especialidad
            )

        messages.success(request, 'El médico se ha registrado correctamente.')
        return redirect('doctores')

    #return redirect('register')


# login para medicos
def login_medico(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if hasattr(user, 'role') and user.role == 'Medico':
                login(request, user)
                return redirect('inicio')
            else:
                messages.error(request, 'El usuario no es un medico.')
                return redirect('login')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login')

import random
import json
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.contrib import messages
from .models import Usuario  # Asegúrate de importar tu modelo Usuario

def forgot_password_medico(request):
    if request.method == "POST":
        email = request.POST['email_recovery']
        print(f"email: {email}")

        # Validamos que el email exista
        if Usuario.objects.filter(email=email).exists():
            user = Usuario.objects.get(email=email)
            if user.role == 'Medico':
                # Generar OTP
                otp = random.randint(100000, 999999)
                request.session['otp'] = otp
                request.session['email'] = email

                # Crear el mensaje del correo
                subject = 'Recuperación de contraseña'
                message = f'Su código de recuperación es: {otp}'
                from_email = 'cristopherquintana2725@gmail.com'  # Remitente (tu dirección de Gmail)
                recipient_list = [email]  # Destinatario

                # Enviar el correo
                try:
                    email_message = EmailMessage(subject, message, from_email, recipient_list)
                    email_message.send(fail_silently=False)
                    return JsonResponse({'status': 'success', 'message': 'Se ha enviado un correo para restablecer la contraseña.'})
                except Exception as e:
                    print(f"Error al enviar el correo: {e}")
                    return JsonResponse({'status': 'error', 'message': 'Error al enviar el correo. Inténtelo de nuevo más tarde.'}, status=500)
            else:
                return JsonResponse({'status': 'error', 'message': 'El usuario no es un médico.'}, status=400)
        else:
            return JsonResponse({'status': 'error', 'message': 'El correo no existe.'}, status=400)


from django.http import JsonResponse
from django.contrib.auth.hashers import make_password

def validate_otp(request):
    if request.method == "POST":
        otp_entered = request.POST.get('otp')
        otp_session = request.session.get('otp')

        if otp_entered and otp_session and int(otp_entered) == otp_session:
            # OTP correcto, permitir cambiar la contraseña
            return JsonResponse({'status': 'success', 'message': 'OTP correcto.', 'allow_password_change': True})
        else:
            return JsonResponse({'status': 'error', 'message': 'OTP incorrecto.'}, status=400)

def change_password(request):
    if request.method == "POST":
        new_password = request.POST.get('new_password')
        email = request.session.get('email')

        if email and new_password:
            try:
                user = Usuario.objects.get(email=email)
                user.password = make_password(new_password)  # Hashear la nueva contraseña
                user.save()
                return JsonResponse({'status': 'success', 'message': 'Contraseña cambiada correctamente.'})
            except Usuario.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Usuario no encontrado.'}, status=400)
        else:
            return JsonResponse({'status': 'error', 'message': 'Datos incompletos.'}, status=400)

@csrf_exempt
def send_reminder(request):
    if request.method == "POST":
        phone_number = request.POST.get('phone_number')
        message = request.POST.get('message')

        print(f"phone_number: {phone_number}")

        try:
            # Enviar mensaje de recordatorio
            kit.sendwhatmsg_instantly(phone_number, message)
            return JsonResponse({'status': 'success', 'message': 'Recordatorio enviado correctamente.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error al enviar el recordatorio: {str(e)}'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido.'}, status=405)

# login para pacientes
def login_paciente(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        print(f"username: {username}, password: {password}")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if  hasattr(user, 'role') and user.role == 'Paciente':
                login(request, user)
                return redirect('dashboard_paciente')
            else:
                messages.error(request, 'El usuario no es un paciente.')
                return redirect('login')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login')
        
def login_usuario(request):
    return render(request, 'citas2/login.html')

def register(request):
    return render(request, 'citas2/register.html')

@login_required
def inicio(request):
    citas_list = Cita.objects.all()
    registros_list = Registro.objects.select_related('id_enfermedad', 'id_cita').prefetch_related('tratamientos', 'registroproducto_set')
    
    citas_paginator = Paginator(citas_list, 10)
    registros_paginator = Paginator(registros_list, 10)

    enfermedades = Enfermedad.objects.all()
    productos = Producto.objects.all()

    page_number = request.GET.get('page', 1)


    try:
        citas = citas_paginator.get_page(page_number)
        registros = registros_paginator.get_page(page_number)
    except PageNotAnInteger:
        citas = citas_paginator.page(1)
        registros = registros_paginator.page(1)
    except EmptyPage:
        citas = citas_paginator.page(citas_paginator.num_pages)
        registros = registros_paginator.page(registros_paginator.num_pages)
    
    print(f"Citas: {citas}")
    print(f"Registros: {registros}")

    return render(
        request,
        "citas2/index.html",
        {
            "citas": citas,
            "registros": registros,
            "enfermedades": enfermedades,
            "productos": productos
        }
    )

# vista personalizada para el logout
def logout_user(request):

    #return HttpResponse(f"{request.user.role}")
    if hasattr(request.user, 'role'):
        user_role = request.user.role
    else:
        user_role = None
    
    logout(request)

    return redirect('login')

# vista del dashboard del medico
@login_required(login_url='login_medico')
def dashboard_medico(request):
    if hasattr(request.user, 'role') and request.user.role == 'Medico':
        return render(request, 'citas/dashboard_medico.html')
    else:
        return redirect('login_medico')
    

# vista del dashboard del paciente
@login_required(login_url='login_paciente')
def dashboard_paciente(request):
    if  hasattr(request.user, 'role') and request.user.role == 'Paciente':
        return render(request, 'citas/dashboard_paciente.html')
    else:
        return redirect('login_paciente')

# vista para crear alergias
def crear_alergia(request):
    if request.method == "POST":
        # datos de la alergia
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']

        print(f"Nombre: {nombre}")
        print(f"Descripcion: {descripcion}")
        #return HttpResponse("Alergia creada")

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('crear_alergia')

        if Alergia.objects.filter(nombre=nombre).exists():
            messages.error(request, 'La alergia ya existe.')
            return redirect('crear_alergia')

        alergia = Alergia.objects.create(
            nombre=nombre,
            descripcion=descripcion
        )

        messages.success(request, 'La alergia se ha creado correctamente.')
        return redirect('enfermedades_alergias')
    #return render(request, 'citas/crear_alergia.html')

@login_required
def listar_alergias(request):
    alergias = Alergia.objects.all()
    return render(request, 'citas2/alergias.html', {'alergias': alergias})

# crear especialidades
def crear_especialidad(request):
    if request.method == "POST":
        # datos de la especialidad
        nombre = request.POST['nombre']

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('crear_especialidad')

        if Especialidad.objects.filter(nombre=nombre).exists():
            messages.error(request, 'La especialidad ya existe.')
            return redirect('crear_especialidad')

        Especialidad.objects.create(
            nombre=nombre,
        )

        messages.success(request, 'La especialidad se ha creado correctamente.')
        return redirect('crear_especialidad')
    
    return render(request, 'citas/crear_especialidad.html')

def vista_error(request):
    return render(request, 'citas2/vista_error.html')

@admin_medico_required
@login_required
def listar_medicos(request):
    
    medicos = Medico.objects.prefetch_related('medicoespecialidad_set__id_especialidad')
    especialidades = Especialidad.objects.all()
    print(f"Medicos: {medicos}")
    return render(request, 'citas2/medicos.html', {'medicos': medicos, 'especialidades': especialidades})

def detalle_medico(request, medico_id):
    try:
        medico = Medico.objects.get(id=medico_id)
        especialidades = MedicoEspecialidad.objects.filter(id_medico=medico)
    except Medico.DoesNotExist:
        messages.error(request, 'El médico no existe.')
        return redirect('listar_medicos')

    return render(request, 'citas/detalle_medico.html', {'medico': medico, 'especialidades': especialidades})

def asignar_especialidad(request, medico_id):
    try:
        medico = Medico.objects.get(id=medico_id)
    except Medico.DoesNotExist:
        messages.error(request, 'El medico no existe.')
        return redirect('listar_medicos')
    
    especialidades = Especialidad.objects.all()

    if request.method == "POST":
        especialidades_seleccionadas = request.POST.getlist('especialidades')

        for especialidad_id in especialidades_seleccionadas:
            especialidad = Especialidad.objects.get(id_especialidad=especialidad_id)
            if not MedicoEspecialidad.objects.filter(id_medico=medico, id_especialidad=especialidad).exists():
                MedicoEspecialidad.objects.create(id_medico=medico, id_especialidad=especialidad)
            else:
                messages.warning(
                    request, f"La especialidad '{especialidad.nombre}' ya está asignada al médico."
                )
                return redirect('asignar_especialidad', medico_id=medico_id)
        
        messages.success(request, 'Las especialidades se han asignado correctamente.')
        return redirect('detalle_medico', medico_id=medico_id)
    
    return render(request, 'citas/asignar_especialidad.html', {'medico': medico, 'especialidades': especialidades})

# vistas para enfermedades
@admin_medico_required
@login_required
def listar_enfermedades_alergias(request):
    enfermedades = Enfermedad.objects.all()
    alergias = Alergia.objects.all()
    # ruta_original = citas/listar_enfermedades.html
    return render(request, 'citas2/enfermedades-alergia.html', {'enfermedades': enfermedades, 'alergias': alergias})

def crear_enfermedad(request):
    if request.method == "POST":
        # datos de la enfermedad
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('crear_enfermedad')
        
        print(f"Nombre: {nombre}")
        print(f"Descripcion: {descripcion}")
        #return HttpResponse("Enfermedad agregada")

        if Enfermedad.objects.filter(nombre=nombre).exists():
            messages.error(request, 'La enfermedad ya existe.')
            return redirect('crear_enfermedad')
        
        Enfermedad.objects.create(
            nombre=nombre,
            descripcion=descripcion
        )

        messages.success(request, 'La enfermedad se ha creado correctamente.')
        return redirect('enfermedades_alergias')
    
    return render(request, 'citas/crear_enfermedad.html')

# vistas para tratamentos
@login_required
def listar_tratamientos(request):
    tratamientos = Tratamiento.objects.prefetch_related('tratamientoenfermedad_set__id_enfermedad')
    print(f"Tratamientos: {tratamientos}")

    # mostrando la enfermedad que trata cada tratamiento
    for tratamiento in tratamientos:
        print(f"Tratamiento: {tratamiento} - Enfermedades: {tratamiento.tratamientoenfermedad_set.all()}")
    return render(request, 'citas2/tratamientos.html', {'tratamientos': tratamientos})

# buscar enfermedades
@login_required
def buscar_enfermedades(request):
    if request.method == 'GET':
        query = request.GET.get("q", "")
        if query:
            enfermedades = Enfermedad.objects.filter(
                nombre__icontains=query
            ).values('id_enfermedad', 'nombre')

            return JsonResponse(list(enfermedades), safe=False)
        
        return JsonResponse([], safe=False)


@login_required
def crear_tratamiento(request):
    if request.method == "POST":
        # datos del tratamiento
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']
        id_enfermedad = request.POST.get('id_enfermedad')

        print(f"Nombre: {nombre}")
        print(f"Descripcion: {descripcion}")
        print(f"id_enfermedad: {id_enfermedad}")

        # verificamos si la enfermedad existe
        enfermedad = get_object_or_404(Enfermedad, id_enfermedad=id_enfermedad)

        #return HttpResponse("tratamiento creado")

        # verificar si ya existe un tratamiento con el mismo nombre
        if Tratamiento.objects.filter(nombre=nombre).exists():
            messages.error(request, 'El tratamiento ya existe.')
            return redirect('tratamientos')
        

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('tratamientos')

        if Tratamiento.objects.filter(nombre=nombre).exists():
            messages.error(request, 'El tratamiento ya existe.')
            return redirect('tratamientos')
        
        # creando el tratamiento
        tratamiento = Tratamiento.objects.create(
            nombre=nombre,
            descripcion=descripcion
        )

        # asociar el tratamiento con la enfermedad a tratar
        TratamientoEnfermedad.objects.create(
            id_tratamiento=tratamiento,
            id_enfermedad=enfermedad
        )

        messages.success(request, 'El tratamiento se ha creado correctamente.')
        return redirect('tratamientos')
    
    #return render(request, 'citas/crear_tratamiento.html')

@login_required
def asignar_tratamiento(request):
    if request.method == "POST":
        tratamiento_id = request.POST.get('tratamiento')
        enfermedad_id = request.POST.get('enfermedad')

        #tratamiento = Tratamiento.objects.get(id_tratamiento=tratamiento_id)
        if not enfermedad_id or not tratamiento_id:
            messages.error(request, 'Debe seleccionar una enfermedad y un tratamiento.')
            return redirect('asignar_tratamiento')
        
        try:
            tratamiento = Tratamiento.objects.get(id_tratamiento=tratamiento_id)
            enfermedad = Enfermedad.objects.get(id_enfermedad=enfermedad_id)
        except (Tratamiento.DoesNotExist, Enfermedad.DoesNotExist):
            messages.error(request, 'El tratamiento o enfermedad no existe.')
            return redirect('asignar_tratamiento')

        if TratamientoEnfermedad.objects.filter(id_tratamiento=tratamiento, id_enfermedad=enfermedad).exists():
            messages.error(request, 'El tratamiento ya está asignado a la enfermedad.')
            return redirect('asignar_tratamiento')

        TratamientoEnfermedad.objects.create(
            id_tratamiento=tratamiento,
            id_enfermedad=enfermedad
        )

        messages.success(request, 'El tratamiento se ha asignado correctamente.')
        return redirect('asignar_tratamiento')
    
    tratamientos = Tratamiento.objects.all()
    enfermedades = Enfermedad.objects.all()
    return render(request, 'citas/asignar_tratamiento.html', {'tratamientos': tratamientos, 'enfermedades': enfermedades})

def listar_enfermedades_tratamientos(request):
    enfermedades = Enfermedad.objects.all()
    tratamientos_asociados = {
        enfermedad: TratamientoEnfermedad.objects.filter(id_enfermedad=enfermedad) for enfermedad in enfermedades
    }

    return render(request, 'citas/listar_enfermedades_tratamientos.html', {'enfermedades': enfermedades, 'tratamientos_asociados': tratamientos_asociados})

@login_required
def agregar_producto(request):
    tipos = ["Cremas", "Geles", "Lociones", "Sueros", "Protector solar", "Jabón dermatológico"]

    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        precio = request.POST.get('precio')
        marca = request.POST.get('marca')
        tipo = request.POST.get('tipo')

        print(f"Nombre: {nombre}")
        print(f"Descripción: {descripcion}")
        print(f"Precio: {precio}")
        print(f"Marca: {marca}")
        print(f"Tipo: {tipo}")

        #return HttpResponse("producto agregado")

        # Validaciones básicas
        if not nombre or not precio or not marca or not tipo:
            messages.error(request, "Por favor, completa todos los campos obligatorios.")
        else:
            try:
                # Crear el producto
                producto = Producto(
                    nombre=nombre,
                    descripcion=descripcion,
                    precio=precio,
                    marca=marca,
                    tipo=tipo
                )
                producto.save()
                messages.success(request, "Producto agregado exitosamente.")
                return redirect('productos')  # Redirigir a la lista de productos
            except Exception as e:
                messages.error(request, f"Ocurrió un error al guardar el producto: {e}")

    #return render(request, 'citas/agregar_producto.html', {'tipos': tipos})

@admin_medico_required
@login_required
def listar_productos(request):
    productos = Producto.objects.all()
    tipos = ["Cremas", "Geles", "Lociones", "Sueros", "Protector solar", "Jabón dermatológico"]
    print(f"Productos: {productos}")
    return render(request, 'citas2/productos.html', {'productos': productos, 'tipos': tipos})

# editar citas
def editar_cita(request):
    if request.method == "POST":
        id_cita = request.POST.get('id_cita')
        nuevo_estado = request.POST.get('estado')

        print(f"Id_cita: {id_cita}")
        print(f"Nuevo estado: {nuevo_estado}")

        #return HttpResponse("Cita editada correctamente")

        # validar datos
        if not id_cita or not nuevo_estado:
            messages.error(request, "Por favor, completa todos los campos obligatorios.")
            return redirect('editar_cita')
        
        try:
            cita = Cita.objects.get(id_cita=id_cita)
        except Cita.DoesNotExist:
            messages.error(request, "La cita no existe.")
            return redirect('inicio')
        
        cita.estado = nuevo_estado
        cita.save()
        messages.success(request, "Cita actualizada exitosamente.")
        return redirect('inicio')

# crear citas
@login_required
def crear_cita(request):
    if request.method == "POST":
        id_paciente = request.POST.get('id_paciente')
        id_medico = request.POST.get('id_medico')
        id_especialidad = request.POST.get('id_especialidad')
        fecha = request.POST.get('fecha')
        hora = request.POST.get('hora_inicio')

        
        print(f"Id_paciente: {id_paciente}")
        print(f"Id_medico: {id_medico}")
        print(f"Id_especialidad: {id_especialidad}")
        print(f"Fecha: {fecha}")
        print(f"Hora: {hora}")

        #return HttpResponse(f"{id_paciente}, {id_medico}, {id_especialidad}, {fecha}, {hora}")

        # validaciones basicas
        if not id_paciente or not id_medico or not id_especialidad or not fecha or not hora:
            print("entro")
            messages.error(request, "Por favor, completa todos los campos obligatorios.")
            return redirect('crear_cita')
        
        # validar que la especialidad del medico este asociada al medico
        medico_especialidad = MedicoEspecialidad.objects.filter(
            id_medico=id_medico, id_especialidad=id_especialidad
        ).first()

        if not medico_especialidad:
            print("entro2")
            messages.error(request, "La especialidad seleccionada no está asociada al médico.")
            return redirect('crear_cita')
        
        # crear la cita
        paciente = get_object_or_404(Paciente, pk=id_paciente)
        medico = get_object_or_404(Medico, pk=id_medico)
        especialidad = get_object_or_404(Especialidad, pk=id_especialidad)
        Cita.objects.create(
            id_paciente=paciente,
            id_medico=medico,
            id_especialidad=especialidad,
            fecha=fecha,
            hora=hora
        )

        print("Cita creada correctamente")
        messages.success(request, "Cita creada exitosamente.")
        return redirect('inicio')


def listar_citas(request):
    citas = Cita.objects.all()
    return render(request, 'citas/listar_citas.html', {'citas': citas})

# buscar por nombres de pacientes y medicos
@login_required
def buscar_pacientes(request):
    query = request.GET.get('q', '')
    pacientes = Paciente.objects.filter(user__first_name__icontains=query)[:10]
    resultados = [
        {'id': paciente.id, 'nombre': paciente.user.first_name, 'apellido': paciente.user.last_name}
        for paciente in pacientes
    ]

    print(f"Resultados: {resultados}")

    return JsonResponse(resultados, safe=False)

@login_required
def buscar_medicos(request):
    query = request.GET.get('q', '')
    medicos = Medico.objects.filter(user__first_name__icontains=query)[:10]
    resultados = [
        {'id': medico.id, 'nombre': medico.user.first_name, 'apellido': medico.user.last_name}
        for medico in medicos
    ]
    return JsonResponse(resultados, safe=False)

@login_required
def obtener_especialidades(request):
    medico_id = request.GET.get('id_medico')
    if medico_id:
        especialidades = MedicoEspecialidad.objects.filter(id_medico=medico_id).select_related('id_especialidad')
        especialidades_data = [{"id": e.id_especialidad.id_especialidad, "nombre": e.id_especialidad.nombre} for e in especialidades]
        return JsonResponse(especialidades_data, safe=False)
    return JsonResponse({"error": "Médico no encontrado"}, status=400)

@login_required
def buscar_cita(request):
    if request.method == "GET":
        codigo_cita = request.GET.get("codigo_cita", None)
        print(f"Codigo de cita: {codigo_cita}")
        if codigo_cita:
            try:
                cita = Cita.objects.get(id_cita=codigo_cita)
                data = {
                    "paciente": f"{cita.id_paciente.user.first_name} {cita.id_paciente.user.last_name}",
                    "medico": f"{cita.id_medico.user.first_name} {cita.id_medico.user.last_name}"
                }
                return JsonResponse({"success": True, "data": data})
            except Cita.DoesNotExist:
                return JsonResponse({"success": False, "error": "Cita no encontrada"})
        
        return JsonResponse({"success": False, "error": "Código no proporcionado"})
    
    return JsonResponse({"success": False, "error": "Metodo no permitido"})

@login_required
def crear_registro(request):
    if request.method == "POST":
        # Obtener los datos del formulario
        motivo = request.POST.get('motivo')
        observaciones = request.POST.get('observaciones')
        id_cita = request.POST.get('codigo_cita')
        id_enfermedad = request.POST.get('id_enfermedad')
        tratamientos_seleccionados = request.POST.getlist('tratamientos')
        productos_recomendados = request.POST.getlist('productos')

        print(f"Motivo: {motivo}")
        print(f"Observaciones: {observaciones}")
        print(f"ID Cita: {id_cita}")
        print(f"ID Enfermedad: {id_enfermedad}")
        print(f"Tratamientos seleccionados: {tratamientos_seleccionados}")
        print(f"Productos recomendados: {productos_recomendados}")

        #return HttpResponse("Cita creada")

        # Validación de los campos
        if motivo and observaciones and id_cita and id_enfermedad:
            # Crear el registro
            try:
                registro = Registro(
                    motivo=motivo,
                    observaciones=observaciones,
                    id_cita_id=id_cita,
                    id_enfermedad_id=id_enfermedad
                )
                registro.save()

                # Asociar tratamientos al registro
                for tratamiento_id in tratamientos_seleccionados:
                    RegistroTratamiento.objects.create(
                        id_registro=registro,
                        id_tratamiento_id=tratamiento_id
                    )

                # Asociar productos al registro
                for producto_id in productos_recomendados:
                    RegistroProducto.objects.create(
                        id_registro=registro,
                        id_producto_id=producto_id
                    )

                messages.success(request, '¡Registro creado exitosamente!')
                return redirect('inicio')  # Redirigir para evitar reenvío de formulario
            except Exception as e:
                messages.error(request, f'Error al crear el registro: {e}')
        else:
            messages.error(request, 'Todos los campos son obligatorios.')


@login_required
def tratamientos_por_enfermedad(request):
    enfermedad_id = request.GET.get('id_enfermedad')
    if enfermedad_id:
        tratamientos = TratamientoEnfermedad.objects.filter(id_enfermedad=enfermedad_id).select_related('id_tratamiento')

        data = [
            {
                "id_tratamiento": t.id_tratamiento.id_tratamiento,
                "nombre": t.id_tratamiento.nombre,
                "descripcion": t.id_tratamiento.descripcion
            }
            for t in tratamientos
        ]
        
        return JsonResponse({"tratamientos": data})
    
    return JsonResponse({"error": "Enfermedad no encontrada"}, status=400)