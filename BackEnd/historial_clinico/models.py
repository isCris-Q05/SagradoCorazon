from django.db import models

class Alergia(models.Model):
    codigo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class PacienteAlergia(models.Model):
    id_paciente = models.ForeignKey('usuarios.Paciente', on_delete=models.CASCADE, related_name='alergias')
    codigo = models.ForeignKey(Alergia, on_delete=models.CASCADE, related_name='pacientes')

    class Meta:
        unique_together = ('id_paciente', 'codigo')

    def __str__(self):
        return f"{self.id_paciente} - {self.codigo}"

class Enfermedad(models.Model):
    id_enfermedad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class PacienteEnfermedad(models.Model):
    id_paciente = models.ForeignKey('usuarios.Paciente', on_delete=models.CASCADE)
    id_enfermedad = models.ForeignKey(Enfermedad, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_paciente', 'id_enfermedad')

    def __str__(self):
        return f"{self.id_paciente} - {self.id_enfermedad}"

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

class Registro(models.Model):
    id_registro = models.AutoField(primary_key=True)
    motivo = models.TextField()
    observaciones = models.TextField()
    id_cita = models.ForeignKey('citas.Cita', on_delete=models.CASCADE)
    id_enfermedad = models.ForeignKey(Enfermedad, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id_registro} - {self.id_enfermedad}"

class RegistroTratamiento(models.Model):
    id_registro = models.ForeignKey(Registro, on_delete=models.CASCADE, related_name="tratamientos")
    id_tratamiento = models.ForeignKey(Tratamiento, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_registro', 'id_tratamiento')

    def __str__(self):
        return f"Registro {self.id_registro.id_registro} - Tratamiento {self.id_tratamiento.nombre}"
