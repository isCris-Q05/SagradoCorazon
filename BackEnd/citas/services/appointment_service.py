from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q
from citas.models import Cita

# Single Responsibility Principle (SRP): Esta clase se encarga única y exclusivamente 
# de la lógica de negocio relacionada con la actualización y gestión de citas,
# separando esta responsabilidad de los controladores (views.py).
class AppointmentService:
    @staticmethod
    def actualizar_estado_citas():
        """
        Actualiza citas pendientes a "No asistió" cuando han pasado 15 minutos 
        de la hora programada sin ser marcadas como "Finalizada"
        """
        ahora_managua = timezone.localtime(timezone.now())
        umbral_tiempo = ahora_managua - timedelta(minutes=15)
        
        citas_no_asistidas = Cita.objects.filter(
            estado=Cita.PENDIENTE
        ).filter(
            Q(fecha__lt=ahora_managua.date()) |
            Q(
                fecha=ahora_managua.date(),
                hora__lte=umbral_tiempo.time()
            )
        )
        
        actualizadas = citas_no_asistidas.update(estado=Cita.NO_ASISTIO)
        return actualizadas
