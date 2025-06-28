document.addEventListener('DOMContentLoaded', function() {
    const backupForm = document.getElementById('backupForm');
    const backupButton = document.getElementById('subirReporteBtn');
    const backupAlert = document.getElementById('customBackupAlert');
    
    // Asegurarnos que la alerta está oculta al inicio
    backupAlert.classList.remove('show');
    
    if (backupForm && backupButton) {
        backupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Formulario enviado'); // Debug
            
            // Mostrar estado de carga
            const originalContent = backupButton.innerHTML;
            backupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando Backup...';
            backupButton.disabled = true;
            
            // Obtener el token CSRF
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            console.log('Enviando solicitud...'); // Debug
            
            // Enviar la solicitud
            fetch(backupForm.action, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(new FormData(backupForm))
            })
            .then(response => {
                console.log('Respuesta recibida', response); // Debug
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data); // Debug
                if (data.status === 'success') {
                    // Mostrar alerta de éxito
                    document.getElementById('backupMessage').textContent = data.message;
                    showAlert();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error); // Debug
                // Mostrar alerta de error
                document.getElementById('backupMessage').textContent = error.message;
                backupAlert.querySelector('.backup-alert-icon').style.backgroundColor = '#f44336';
                backupAlert.querySelector('.backup-alert-icon').innerHTML = '<i class="fas fa-times-circle"></i>';
                backupAlert.querySelector('.backup-alert-title').textContent = 'Error';
                showAlert();
            })
            .finally(() => {
                // Restaurar el botón
                backupButton.innerHTML = originalContent;
                backupButton.disabled = false;
            });
        });
    }
    
    function showAlert() {
        console.log('Mostrando alerta'); // Debug
        backupAlert.classList.add('show');
        
        // Configurar el evento de cierre
        const closeButton = backupAlert.querySelector('.backup-alert-button');
        
        function closeAlert() {
            console.log('Cerrando alerta'); // Debug
            backupAlert.classList.remove('show');
        }
        
        function outsideClick(e) {
            if (e.target === backupAlert) {
                closeAlert();
            }
        }
        
        closeButton.addEventListener('click', closeAlert);
        backupAlert.addEventListener('click', outsideClick);
        
        // Limpiar eventos anteriores para evitar duplicados
        closeButton.removeEventListener('click', closeAlert);
        backupAlert.removeEventListener('click', outsideClick);
        closeButton.addEventListener('click', closeAlert);
        backupAlert.addEventListener('click', outsideClick);
    }
});