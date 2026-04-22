from django.db import models

# Single Responsibility Principle (SRP): El modelo Producto solo maneja los datos estáticos 
# de los productos del inventario, mientras que su uso en registros clínicos se maneja en otra entidad.
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    marca = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class RegistroProducto(models.Model):
    id_registro = models.ForeignKey('historial_clinico.Registro', on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_registro', 'id_producto')

    def __str__(self):
        return f"{self.id_registro} - {self.id_producto}"
