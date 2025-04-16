document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre del archivo seleccionado
    document.getElementById('excelFileInput').addEventListener('change', function(e) {
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
            fileNameDisplay.innerHTML += '<span class="text-success ms-2"><i class="fas fa-check-circle"></i></span>';
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // Manejar el envío del formulario
    document.getElementById('excelUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitUploadBtn');
        const originalText = submitBtn.innerHTML;
        const uploadResult = document.getElementById('uploadResult');
        
        // Limpiar resultados anteriores
        uploadResult.innerHTML = '';
        
        // Mostrar animación de procesando
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        
        // Crear FormData para enviar el archivo
        const formData = new FormData(this);
        
        // Enviar el formulario via AJAX
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'X-Requested-With': 'XMLHttpRequest'  // Para que Django detecte que es AJAX
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar resultados
            if (data.status === 'success') {
                uploadResult.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        ${data.message}
                    </div>
                `;
                
                // Actualizar la página después de 2 segundos
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else if (data.status === 'partial') {
                let errorsHtml = data.errors.map(error => `
                    <div class="alert alert-warning mb-2">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${error}
                    </div>
                `).join('');
                
                uploadResult.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        ${data.message}
                    </div>
                    ${errorsHtml}
                `;
            } else {
                uploadResult.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-times-circle me-2"></i>
                        ${data.message || 'Error al subir el archivo'}
                    </div>
                `;
            }
        })
        .catch(error => {
            uploadResult.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle me-2"></i>
                    Error en la comunicación con el servidor: ${error.message}
                </div>
            `;
        })
        .finally(() => {
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
    
    // Resetear el modal cuando se cierre
    document.getElementById('uploadModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('excelFileInput').value = '';
        document.getElementById('fileNameDisplay').textContent = '';
        document.getElementById('uploadResult').innerHTML = '';
    });
});