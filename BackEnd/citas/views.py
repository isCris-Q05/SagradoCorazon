from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Usuario, Paciente, Medico, Alergia, Especialidad, MedicoEspecialidad, Enfermedad, Tratamiento
from django.contrib import messages
# Create your views here.
def index(request):
    return render(request, "citas/index.html")


# registrar pacientes
def registrar_paciente(request):
    if request.method == "POST":
        # Datos del usuario
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        role = 'Paciente'
        genero = request.POST.get('genero', '')

        # datos del paciente
        cedula = request.POST.get('cedula', '')
        cedula = request.POST.get('cedula')
        telefono = request.POST.get('telefono', '')
        fecha_nacimiento = request.POST.get('fecha_nacimiento')

        # validaciones
        if Usuario.objects.filter(username=username).exists():
            messages.error(request, 'El nombre de usuario ya está registrado.')
            return redirect('registrar_paciente')
        
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'El correo electronico ya está registrado.')
            return redirect('registrar_paciente')
        
        if password1 != password2:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('registrar_paciente')
        
        # crear el usuario
        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password1,
            first_name=first_name,
            last_name=last_name,
            role=role,
            genero=genero
        )

        # creamos el paciente
        paciente = Paciente.objects.create(
            user=user,
            cedula=cedula,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento
        )

        messages.success(request, 'El paciente se ha registrado correctamente.')
        return redirect('registrar_paciente')

    return render(request, 'citas/registro_paciente.html')

def registrar_medico(request):
    if request.method == "POST":
        # Datos del usuario
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        role = 'Medico'
        genero = request.POST.get('genero', '')

        # datos del medico
        telefono = request.POST.get('telefono', '')

        # validaciones
        if Usuario.objects.filter(username=username).exists():
            messages.error(request, 'El nombre de usuario ya está registrado.')
            return redirect('registrar_medico')
        
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'El correo electronico ya está registrado.')
            return redirect('registrar_medico')
        
        if password1 != password2:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('registrar_medico')
        
        # crear el usuario
        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password1,
            first_name=first_name,
            last_name=last_name,
            role=role,
            genero=genero
        )

        # creamos el medico
        medico = Medico.objects.create(
            user=user,
            telefono=telefono
        )

        messages.success(request, 'El medico se ha registrado correctamente.')
        return redirect('registrar_medico')

    return render(request, 'citas/registro_medico.html')

# login para medicos
def login_medico(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if hasattr(user, 'role') and user.role == 'Medico':
                login(request, user)
                return redirect('dashboard_medico')
            else:
                messages.error(request, 'El usuario no es un medico.')
                return redirect('login_medico')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login_medico')

    return render(request, 'citas/login_medico.html')

# login para pacientes
def login_paciente(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if  hasattr(user, 'role') and user.role == 'Paciente':
                login(request, user)
                return redirect('dashboard_paciente')
            else:
                messages.error(request, 'El usuario no es un paciente.')
                return redirect('login_paciente')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login_paciente')
        

    return render(request, 'citas/login_paciente.html')

# vista personalizada para el logout
def logout_user(request):

    #return HttpResponse(f"{request.user.role}")
    if hasattr(request.user, 'role'):
        user_role = request.user.role
    else:
        user_role = None
    
    logout(request)

    # redirigimos segun el rol
    if user_role == 'Paciente':
        return redirect('login_paciente')
    elif user_role == 'Medico':
        return redirect('login_medico')

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
        return redirect('crear_alergia')
    
    return render(request, 'citas/crear_alergia.html')

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

def listar_medicos(request):
    medicos = Medico.objects.all()
    return render(request, 'citas/listar_medicos.html', {'medicos': medicos})

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
def listar_enfermedades(request):
    enfermedades = Enfermedad.objects.all()
    return render(request, 'citas/listar_enfermedades.html', {'enfermedades': enfermedades})

def crear_enfermedad(request):
    if request.method == "POST":
        # datos de la enfermedad
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('crear_enfermedad')

        if Enfermedad.objects.filter(nombre=nombre).exists():
            messages.error(request, 'La enfermedad ya existe.')
            return redirect('crear_enfermedad')
        
        Enfermedad.objects.create(
            nombre=nombre,
            descripcion=descripcion
        )

        messages.success(request, 'La enfermedad se ha creado correctamente.')
        return redirect('crear_enfermedad')
    
    return render(request, 'citas/crear_enfermedad.html')

# vistas para tratamentos
def listar_tratamientos(request):
    tratamientos = Tratamiento.objects.all()
    return render(request, 'citas/listar_tratamientos.html', {'tratamientos': tratamientos})

def crear_tratamiento(request):
    if request.method == "POST":
        # datos del tratamiento
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']

        if not nombre:
            messages.error(request, 'El nombre es obligatorio.')
            return redirect('crear_tratamiento')

        if Tratamiento.objects.filter(nombre=nombre).exists():
            messages.error(request, 'El tratamiento ya existe.')
            return redirect('crear_tratamiento')
        
        Tratamiento.objects.create(
            nombre=nombre,
            descripcion=descripcion
        )

        messages.success(request, 'El tratamiento se ha creado correctamente.')
        return redirect('crear_tratamiento')
    
    return render(request, 'citas/crear_tratamiento.html')