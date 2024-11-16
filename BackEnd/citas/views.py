from django.shortcuts import render, HttpResponse, redirect
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