from django.db import models

# Open/Closed Principle (OCP): El uso de choices (ESTADO_CHOICES) permite agregar nuevos
# estados en el futuro sin modificar la lógica interna ni la estructura de base de datos de esta clase.
class Cita(models.Model):
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
    id_paciente = models.ForeignKey('usuarios.Paciente', on_delete=models.CASCADE)
    id_medico = models.ForeignKey('usuarios.Medico', on_delete=models.CASCADE)
    id_especialidad = models.ForeignKey('usuarios.Especialidad', on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default=PENDIENTE)

    def __str__(self):
        return f"{self.id_paciente} - {self.id_medico} - {self.fecha} - {self.hora}"
