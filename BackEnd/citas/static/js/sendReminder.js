document.addEventListener('DOMContentLoaded', function() {
    const sendNotificationButton = document.getElementById('sendNotification');

    if (sendNotificationButton) {
        sendNotificationButton.addEventListener('click', function() {
            const phoneNumber = "+50575463081";  // Número de teléfono del paciente
            const message = "Hola, este es un recordatorio de su cita en la clínica dermatológica.";  // Mensaje de recordatorio

            // Datos a enviar en la solicitud POST
            const formData = new FormData();
            formData.append('phone_number', phoneNumber);
            formData.append('message', message);

            // Enviar la solicitud POST
            fetch("/send-reminder/", {  // Usa la URL correcta para tu vista
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),  // Obtener el token CSRF
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Recordatorio enviado correctamente.');
                } else {
                    alert('Error al enviar el recordatorio: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error en la solicitud: ' + error.message);
            });
        });
    }

    // Función para obtener el token CSRF desde las cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});