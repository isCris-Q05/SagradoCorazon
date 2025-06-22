let currentFilter = '';
let currentPage = 1;

async function filtrarCitas(tipo, page = 1) {
    currentFilter = tipo;
    currentPage = page;
    
    try {
        // 1. Ocultar el paginador estático y eliminar el dinámico si existe
        const paginadorEstatico = document.getElementById('paginadorEstatico');
        const paginadorDinamicoExistente = document.getElementById('paginadorDinamico');
        
        if (paginadorEstatico) paginadorEstatico.style.display = 'none';
        if (paginadorDinamicoExistente) paginadorDinamicoExistente.remove();
        
        // 2. Mostrar loader
        const tablaContainer = document.getElementById('tablaCitas');
        tablaContainer.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Filtrando citas...</p>
            </div>
        `;
        
        // 3. Hacer la petición al backend
        const response = await fetch(`/tipo_citas/${tipo}/?page=${page}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Error al filtrar citas');
        
        // 4. Actualizar la tabla, el contador y mostrar paginador dinámico
        actualizarTablaCitas(data);
        actualizarContadorTotal(data.count);  // Nueva función para actualizar el contador
        crearPaginadorDinamico(data);
        
    } catch (error) {
        console.error('Error:', error);
        
        // Mostrar error y restaurar paginador estático
        const tablaContainer = document.getElementById('tablaCitas');
        if (tablaContainer) {
            tablaContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar las citas: ${error.message}
                </div>
            `;
        }
        
        const paginadorEstatico = document.getElementById('paginadorEstatico');
        if (paginadorEstatico) paginadorEstatico.style.display = 'flex';
    }
}

function actualizarContadorTotal(total) {
    const contadorTotal = document.getElementById('contadorTotal');
    if (contadorTotal) {
        contadorTotal.textContent = total;
        
        // Opcional: Añadir animación para destacar el cambio
        contadorTotal.classList.add('text-success', 'fw-bold');
        setTimeout(() => {
            contadorTotal.classList.remove('text-success', 'fw-bold');
        }, 1000);
    }
}

function actualizarTablaCitas(data) {
    const tablaContainer = document.getElementById('tablaCitas');
    if (!tablaContainer) return;

    // Construir la tabla HTML
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Código de cita</th>
                    <th>Nombre completo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Hora inicio</th>
                    <th>Doctor asignado</th>
                    <th>Notificado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Añadir filas de citas
    data.citas.forEach(cita => {
        const nombrePaciente = `${cita.id_paciente__user__first_name || ''} ${cita.id_paciente__user__last_name || ''}`.trim();
        const nombreMedico = `${cita.id_medico__user__first_name || ''} ${cita.id_medico__user__last_name || ''}`.trim();
        
        let estadoBadge = '';
        if (cita.estado === 'pendiente') {
            estadoBadge = '<span class="badge bg-warning">Pendiente</span>';
        } else if (cita.estado === 'finalizada') {
            estadoBadge = '<span class="badge bg-success">Finalizada</span>';
        } else if (cita.estado === 'no_asistio') {
            estadoBadge = '<span class="badge bg-danger">No asistió</span>';
        }

        // Formatear fecha
        const fecha = new Date(cita.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        html += `
            <tr>
                <td>${cita.id_cita}</td>
                <td>${nombrePaciente}</td>
                <td>${estadoBadge}</td>
                <td>${fechaFormateada}</td>
                <td>${cita.hora}</td>
                <td>${nombreMedico}</td>
                <td><input class="form-check-input" type="checkbox"></td>
                <td>
                    <button class="btn btn-outline-success btn-sm btn-editar-cita"
                        data-id="${cita.id_cita}"
                        data-paciente="${nombrePaciente}"
                        data-estado="${cita.estado}"
                        data-fecha="${cita.fecha}"
                        data-hora="${cita.hora}"
                        data-medico="${nombreMedico}"
                        data-telefono="${cita.id_paciente__telefono || ''}">
                        Editar
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tablaContainer.innerHTML = html;
    inicializarEventosEdicion();
}

function crearPaginadorDinamico(data) {
    const paginadorContainer = document.getElementById('paginadorContainer');
    if (!paginadorContainer) return;
    
    // Crear elemento del paginador dinámico
    const paginadorDinamico = document.createElement('div');
    paginadorDinamico.className = 'd-flex justify-content-between align-items-center mt-3';
    paginadorDinamico.id = 'paginadorDinamico';
    
    // Botón Anterior
    const prevBtn = document.createElement(data.has_previous ? 'a' : 'span');
    prevBtn.className = data.has_previous ? 'btn btn-primary btn-next-prev' : 'btn btn-secondary btn-next-prev disabled';
    prevBtn.textContent = '« Anterior';
    if (data.has_previous) {
        prevBtn.href = '#';
        prevBtn.onclick = (e) => {
            e.preventDefault();
            filtrarCitas(currentFilter, data.current_page - 1);
        };
    }
    
    // Indicador de página
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Página ${data.current_page} de ${data.total_pages}`;
    
    // Botón Siguiente
    const nextBtn = document.createElement(data.has_next ? 'a' : 'span');
    nextBtn.className = data.has_next ? 'btn btn-primary btn-next-prev' : 'btn btn-secondary btn-next-prev disabled';
    nextBtn.textContent = 'Siguiente »';
    if (data.has_next) {
        nextBtn.href = '#';
        nextBtn.onclick = (e) => {
            e.preventDefault();
            filtrarCitas(currentFilter, data.current_page + 1);
        };
    }
    
    // Ensamblar paginador
    paginadorDinamico.append(prevBtn, pageInfo, nextBtn);
    
    // Insertar en el contenedor (reemplazando todo su contenido)
    paginadorContainer.innerHTML = '';
    paginadorContainer.appendChild(paginadorDinamico);
}

function limpiarFiltros() {
    // 1. Restablecer variables
    currentFilter = '';
    currentPage = 1;
    
    // 2. Restablecer contador a valor inicial (opcional)
    const contadorTotal = document.getElementById('contadorTotal');
    if (contadorTotal) {
        contadorTotal.textContent = '0'; // O el valor inicial que prefieras
    }
    
    // 3. Recargar la página para mostrar estado inicial
    window.location.href = window.location.pathname;
}

// Inicializar eventos de edición
function inicializarEventosEdicion() {
    document.querySelectorAll('.btn-editar-cita').forEach(btn => {
        btn.addEventListener('click', function() {
            // Obtener los datos del botón
            const id = this.getAttribute('data-id');
            const paciente = this.getAttribute('data-paciente');
            const estado = this.getAttribute('data-estado');
            const fecha = this.getAttribute('data-fecha');
            const hora = this.getAttribute('data-hora');
            const medico = this.getAttribute('data-medico');
            const telefono = this.getAttribute('data-telefono');
            
            // Aquí puedes llenar tu modal de edición con estos datos
            console.log('Editando cita:', {id, paciente, estado, fecha, hora, medico, telefono});
            
            // Ejemplo de cómo llenar un modal (ajusta según tu HTML)
            /*
            document.getElementById('editCitaId').value = id;
            document.getElementById('editCitaPaciente').value = paciente;
            // ... y así con los demás campos
            */
            
            // Mostrar el modal (si estás usando Bootstrap)
            const editModal = new bootstrap.Modal(document.getElementById('editCitaModal'));
            editModal.show();
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventosEdicion();
});