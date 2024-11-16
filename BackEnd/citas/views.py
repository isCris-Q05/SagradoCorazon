from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Usuario, Paciente, Medico
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
            if user.role == 'Medico':
                login(request, user)
                return redirect('dashboard_medico')
            else:
                messages.error(request, 'El usuario no es un medico.')
                return redirect('login_medico')
        else:
            messages.error(request, 'El usuario o la contraseña son incorrectos.')
            return redirect('login_medico')

    return render(request, 'citas/login_medico.html')

# vista del dashboard del medico
@login_required(login_url='login_medico')
def dashboard_medico(request):
    if request.user.role == 'Medico':
        return render(request, 'citas/dashboard_medico.html')
    else:
        return redirect('login_medico')