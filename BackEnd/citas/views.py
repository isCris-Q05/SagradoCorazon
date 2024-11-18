from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import Usuario, Paciente, Medico, Alergia, Especialidad, MedicoEspecialidad, Enfermedad, Tratamiento,TratamientoEnfermedad, Producto, Cita
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
            return redirect('register')
        
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'El correo electronico ya está registrado.')
            return redirect('register')
        
        if password1 != password2:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('register')
        
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
        return redirect('register')
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
            return redirect('register')
        
        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'El correo electronico ya está registrado.')
            return redirect('register')
        
        if password1 != password2:
            messages.error(request, 'Las contraseñas no coinciden.')
            return redirect('register')
        
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
        return redirect('register')


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
                return redirect('login')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login')

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

def inicio(request):
    citas = Cita.objects.all()
    return render(request, "citas2/index.html", {"citas": citas})

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

def agregar_producto(request):
    tipos = ["Cremas", "Geles", "Lociones", "Sueros", "Protector solar", "Jabón dermatológico"]

    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        precio = request.POST.get('precio')
        marca = request.POST.get('marca')
        tipo = request.POST.get('tipo')

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
                return redirect('listar_productos')  # Redirigir a la lista de productos
            except Exception as e:
                messages.error(request, f"Ocurrió un error al guardar el producto: {e}")

    return render(request, 'citas/agregar_producto.html', {'tipos': tipos})

def listar_productos(request):
    productos = Producto.objects.all()
    tipos = ["Cremas", "Geles", "Lociones", "Sueros", "Protector solar", "Jabón dermatológico"]
    print(f"Productos: {productos}")
    return render(request, 'citas2/productos.html', {'productos': productos, 'tipos': tipos})

# crear citas
def crear_cita(request):
    if request.method == "POST":
        id_paciente = request.POST.get('id_paciente')
        id_medico = request.POST.get('id_medico')
        id_especialidad = request.POST.get('id_especialidad')
        fecha = request.POST.get('fecha')
        hora = request.POST.get('hora')

        print(id_paciente, id_medico, id_especialidad, fecha, hora)

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

        print("entro3")
        messages.success(request, "Cita creada exitosamente.")
        return redirect('crear_cita')
    
    pacientes = Paciente.objects.all()
    medicos = Medico.objects.all()
    especialidades = Especialidad.objects.all()
    return render(request, 'citas/crear_cita.html', {
        'pacientes': pacientes, 
        'medicos': medicos, 
        'especialidades': especialidades,
        })

def listar_citas(request):
    citas = Cita.objects.all()
    return render(request, 'citas/listar_citas.html', {'citas': citas})