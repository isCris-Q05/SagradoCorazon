from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.exceptions import ValidationError

# Open/Closed Principle: este modelo extiende AbstractUser sin modificar su comportamiento interno,
# permitiendo añadir campos y validaciones específicas para el proyecto.
class Usuario(AbstractUser):
    ROLE_CHOICES = [
        ('Paciente', 'Paciente'),
        ('Medico', 'Medico'),
        ('Administrador', 'Administrador'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Paciente')
    genero = models.CharField(max_length=50, blank=True, null=True)

    def clean(self):
        if self.role not in dict(self.ROLE_CHOICES):
            raise ValidationError("Rol inválido.")

    def __str__(self):
        return self.username

# Liskov Substitution Principle: Paciente y Medico heredan de PersonaBase y pueden
# ser usados de forma intercambiable cuando se requiere la interfaz común.
class PersonaBase(models.Model):
    genero = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        abstract = True

    def get_full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return self.get_full_name()

# Single Responsibility Principle: Paciente es responsable únicamente de los datos y relaciones
# del paciente, sin mezclar lógica de médico o citas.
class Paciente(PersonaBase):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='paciente_profile')
    direccion = models.TextField(default='')  # Asignar un valor predeterminado para evitar el error
    motivo = models.TextField(null=True, blank=True)
    cedula = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    enfermedadess = models.JSONField(null=True, blank=True)
    alergiass = models.JSONField(null=True, blank=True)
    contacto_emergencias = models.CharField(max_length=200, null=True)
    telefono_emergencia = models.CharField(max_length=20, blank=True, null=True)
    apellido = models.CharField(max_length=100, default='Desconocido')  # Asignamos un valor predeterminado

class Medico(PersonaBase):
    # Single Responsibility Principle: este modelo encapsula únicamente los datos del médico.
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='medico_profile')
    es_admin = models.BooleanField(default=False)

class Alergia(models.Model):
    codigo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class PacienteAlergia(models.Model):
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='alergias')
    codigo = models.ForeignKey(Alergia, on_delete=models.CASCADE, related_name='pacientes')

    class Meta:
        unique_together = ('id_paciente', 'codigo')

    def __str__(self):
        return f"{self.id_paciente} - {self.codigo}"

class Especialidad(models.Model):
    id_especialidad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class MedicoEspecialidad(models.Model):
    id_medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    id_especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_medico', 'id_especialidad')

    def __str__(self):
        return f"{self.id_medico} - {self.id_especialidad}"

class Cita(models.Model):
    # Open/Closed Principle: agregar nuevos estados se realiza ampliando ESTADO_CHOICES,
    # sin modificar el comportamiento de los consumidores de este modelo.
    PENDIENTE = 'pendiente'
    FINALIZADA = 'finalizada'
    NO_ASISTIO = 'no_asistio'
    ELIMINADA = 'eliminada'

    ESTADO_CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (FINALIZADA, 'Finalizada'),
        (NO_ASISTIO, 'No asistió'),
        (ELIMINADA, 'Eliminada'),
    ]
    
    id_cita = models.AutoField(primary_key=True)
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    id_medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    id_especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default=PENDIENTE)

    def __str__(self):
        return f"{self.id_paciente} - {self.id_medico} - {self.fecha} - {self.hora}"
    
class Enfermedad(models.Model):
    id_enfermedad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class PacienteEnfermedad(models.Model):
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    id_enfermedad = models.ForeignKey(Enfermedad, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_paciente', 'id_enfermedad')

    def __str__(self):
        return f"{self.id_paciente} - {self.id_enfermedad}"

class Registro(models.Model):
    # Single Responsibility Principle: Registro guarda únicamente la información de la consulta
    # específica, separada de la lógica de tratamiento y productos.
    id_registro = models.AutoField(primary_key=True)
    motivo = models.TextField()
    observaciones = models.TextField()
    id_cita = models.ForeignKey(Cita, on_delete=models.CASCADE)
    id_enfermedad = models.ForeignKey(Enfermedad, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id_registro} - {self.id_enfermedad}"

class Tratamiento(models.Model):
    id_tratamiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class TratamientoEnfermedad(models.Model):
    id_tratamiento = models.ForeignKey(Tratamiento, on_delete=models.CASCADE)
    id_enfermedad = models.ForeignKey(Enfermedad, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_tratamiento', 'id_enfermedad')

    def __str__(self):
        return f"{self.id_tratamiento} - {self.id_enfermedad}"
    
class RegistroTratamiento(models.Model):
    id_registro = models.ForeignKey(Registro, on_delete=models.CASCADE, related_name="tratamientos")
    id_tratamiento = models.ForeignKey(Tratamiento, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_registro', 'id_tratamiento')

    def __str__(self):
        return f"Registro {self.id_registro.id_registro} - Tratamiento {self.id_tratamiento.nombre}"

class Producto(models.Model):
    # Single Responsibility Principle: Producto mantiene datos estáticos del producto,
    # mientras que la relación con registros se maneja en RegistroProducto.
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    marca = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class RegistroProducto(models.Model):
    id_registro = models.ForeignKey(Registro, on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_registro', 'id_producto')

    def __str__(self):
        return f"{self.id_registro} - {self.id_producto}"
