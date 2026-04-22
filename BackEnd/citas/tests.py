# Ejecutar pruebas pyhton manage.py test citas
from datetime import date, time
from unittest.mock import patch

from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.utils import timezone

from .models import (
    Usuario,
    Paciente,
    Medico,
    Especialidad,
    Cita,
    Enfermedad,
    Registro,
    Tratamiento,
    RegistroTratamiento,
)

#prueba unitaria
class ModelTests(TestCase):
    def test_usuario_str(self):
        usuario = Usuario.objects.create_user(
            username='testuser',
            password='secret',
            role='Paciente',
            first_name='Test',
            last_name='User',
        )
        self.assertEqual(str(usuario), 'testuser')

    def test_cita_str_and_estado_display(self):
        usuario = Usuario.objects.create_user(
            username='paciente1',
            password='secret',
            role='Paciente',
            first_name='Juan',
            last_name='Perez',
        )
        medico_user = Usuario.objects.create_user(
            username='medico1',
            password='secret',
            role='Medico',
            first_name='Ana',
            last_name='Gomez',
        )
        paciente = Paciente.objects.create(
            user=usuario,
            genero='M',
            direccion='Dirección prueba',
            motivo='Consulta',
            cedula='12345678',
            telefono='5551234',
            fecha_nacimiento=date(1990, 1, 1),
            contacto_emergencias='Maria',
            telefono_emergencia='5554321',
            apellido='Perez',
        )
        medico = Medico.objects.create(user=medico_user, telefono='5550000', es_admin=False)
        especialidad = Especialidad.objects.create(nombre='Cardiología')
        cita = Cita.objects.create(
            id_paciente=paciente,
            id_medico=medico,
            id_especialidad=especialidad,
            fecha=date(2024, 1, 1),
            hora=time(10, 30),
            estado=Cita.FINALIZADA,
        )

        self.assertIn('Juan Perez', str(cita))
        self.assertEqual(cita.get_estado_display(), 'Finalizada')

# Pruebas de integracion
class ViewIntegrationTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.medico_user = Usuario.objects.create_user(
            username='drtest',
            password='pass1234',
            role='Medico',
            first_name='Dr',
            last_name='Test',
            email='drtest@example.com',
        )
        self.medico = Medico.objects.create(
            user=self.medico_user,
            telefono='555000000',
            es_admin=True,
        )

        self.paciente_user = Usuario.objects.create_user(
            username='juanperez',
            password='pass1234',
            role='Paciente',
            first_name='Juan',
            last_name='Perez',
            email='juanperez@example.com',
        )
        self.paciente = Paciente.objects.create(
            user=self.paciente_user,
            genero='M',
            direccion='Calle 1',
            motivo='Chequeo',
            cedula='12345678',
            telefono='88877766',
            fecha_nacimiento=date(1990, 5, 10),
            contacto_emergencias='Ana Perez',
            telefono_emergencia='99988877',
            apellido='Perez',
        )

        self.especialidad = Especialidad.objects.create(nombre='Pediatría')
        self.cita_finalizada = Cita.objects.create(
            id_paciente=self.paciente,
            id_medico=self.medico,
            id_especialidad=self.especialidad,
            fecha=timezone.now().date(),
            hora=timezone.now().time(),
            estado=Cita.FINALIZADA,
        )

        self.enfermedad = Enfermedad.objects.create(nombre='Gripe', descripcion='Infección respiratoria')
        self.registro = Registro.objects.create(
            motivo='Fiebre y dolor de garganta',
            observaciones='Recomendado reposo',
            id_cita=self.cita_finalizada,
            id_enfermedad=self.enfermedad,
        )
        self.tratamiento = Tratamiento.objects.create(nombre='Reposo', descripcion='Descanso absoluto')
        RegistroTratamiento.objects.create(id_registro=self.registro, id_tratamiento=self.tratamiento)

    def test_inicio_redirects_anonymous_to_login(self):
        response = self.client.get(reverse('inicio'))
        self.assertEqual(response.status_code, 302)
        self.assertIn(reverse('login'), response.url)

    def test_cantidad_total_citas_json(self):
        response = self.client.get(reverse('cantidad_total_citas'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

    def test_citas_asistio_contains_finalized_cita(self):
        response = self.client.get(reverse('citas_asistio'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertEqual(response.json()['count'], 1)
        self.assertEqual(response.json()['citas'][0]['estado'], 'Finalizada')

    def test_filtrar_enfermedades_paciente_only(self):
        url = reverse('filtro_enfermedades')
        response = self.client.get(url, {'paciente_username': self.paciente_user.username})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['paciente']['nombre'], 'Juan Perez')
        self.assertEqual(data['registros_paciente'], 1)

    def test_filtrar_enfermedades_enfermedad_only(self):
        url = reverse('filtro_enfermedades')
        response = self.client.get(url, {'id_enfermedad': self.enfermedad.id_enfermedad})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['total_registros'], 1)
        self.assertEqual(data['total_pacientes_unicos'], 1)

    def test_login_paciente_redirects_to_dashboard(self):
        response = self.client.post(
            reverse('login_paciente'),
            {'username': self.paciente_user.username, 'password': 'pass1234'},
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.redirect_chain)
        self.assertIn(reverse('dashboard_paciente'), response.redirect_chain[-1][0])

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    @patch('citas.notifications.EmailMessage.send')
    def test_forgot_password_medico_sends_otp(self, mock_send):
        mock_send.return_value = None
        response = self.client.post(
            reverse('forgot_password_med'),
            {'email_recovery': self.medico_user.email},
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        self.assertEqual(self.client.session['email'], self.medico_user.email)
        self.assertIn('otp', self.client.session)

    def test_registrar_paciente_view_creates_paciente(self):
        form_data = {
            'username': 'newpatient',
            'nombrePaciente': 'Nuevo',
            'apellidoPaciente': 'Paciente',
            'fechaNacimientoPaciente': '1995-04-05',
            'cedulaPaciente': '87654321',
            'generoPaciente': 'F',
            'telefonoPaciente': '77788899',
            'emailPaciente': 'nuevo@example.com',
            'direccionPaciente': 'Av Principal',
            'motivoConsulta': 'Chequeo general',
            'enfermedades': ['Gripe'],
            'alergias': ['Alergia1'],
            'contactoEmergencia': 'Maria',
            'telefonoEmergencia': '77700011',
        }

        response = self.client.post(reverse('registrar_paciente'), form_data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Usuario.objects.filter(username='newpatient').exists())
        self.assertTrue(Paciente.objects.filter(cedula='87654321').exists())
        self.assertIn('El paciente se ha registrado correctamente.', response.content.decode())
