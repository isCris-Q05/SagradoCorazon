from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Open/Closed Principle (OCP): El modelo Usuario extiende AbstractUser de Django.
# Podemos añadir o extender su funcionalidad (roles, géneros) sin modificar el código interno de AbstractUser.
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

# Liskov Substitution Principle (LSP): Paciente y Medico heredan de PersonaBase. 
# En cualquier lugar del sistema donde se requiera una PersonaBase, se puede enviar 
# un Paciente o un Medico de manera intercambiable sin romper la aplicación.
class PersonaBase(models.Model):
    genero = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        abstract = True

    def get_full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return self.get_full_name()

# Single Responsibility Principle (SRP): Este modelo encapsula única y exclusivamente la
# información y lógica correspondiente a un Paciente.
class Paciente(PersonaBase):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='paciente_profile')
    direccion = models.TextField(default='')
    motivo = models.TextField(null=True, blank=True)
    cedula = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    enfermedadess = models.JSONField(null=True, blank=True)
    alergiass = models.JSONField(null=True, blank=True)
    contacto_emergencias = models.CharField(max_length=200, null=True)
    telefono_emergencia = models.CharField(max_length=20, blank=True, null=True)
    apellido = models.CharField(max_length=100, default='Desconocido')

# Single Responsibility Principle (SRP): Este modelo se encarga exclusivamente de la 
# información correspondiente al Médico.
class Medico(PersonaBase):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='medico_profile')
    es_admin = models.BooleanField(default=False)

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
