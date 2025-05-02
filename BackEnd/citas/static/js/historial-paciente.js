document.addEventListener('DOMContentLoaded', () => {
    const historialModal = document.getElementById('historialModal');
    
    if (historialModal) {
        historialModal.addEventListener('show.bs.modal', async (event) => {
            const button = event.relatedTarget;
            
            // Extraer datos del paciente
            const nombre = button.getAttribute('data-name') || 'N/A';
            const apellido = button.getAttribute('data-apellido') || 'Desconocido';
            const telefono = button.getAttribute('data-telefono') || 'No especificado';
            const pacienteId = button.getAttribute('data-paciente-id');
            const username = button.getAttribute('data-username') || 'No especificado';
            
            // Actualizar información del paciente
            document.getElementById('historialNombrePaciente').textContent = `${nombre} ${apellido}`;
            document.getElementById('historialTelefono').textContent = `Teléfono: ${telefono}`;
            document.getElementById('historialUsername').textContent = `Usuario: ${username}`;

            // Mostrar loading
            document.getElementById('citasContenido').innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando historial...</p></div>';
            document.getElementById('tratamientosContenido').innerHTML = '';

            try {
                // Cargar datos del paciente desde el servvidor
                await cargarDatosPaciente(username)
            } catch (error) {
                console.error('Error al cargar datos del paciente:', error);
                document.getElementById('citasContenido').innerHTML = '<div class="alert alert-danger">Error al cargar el historial del paciente</div>';
            }
            
            // Cargar datos del paciente
            //cargarDatosPaciente(pacienteId);
            filtrarCitas('all');
        });
    }

    
});

async function cargarDatosPaciente(username) {
    try {
        const response = await fetch(`/historial_paciente/${username}/`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos del paciente');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'No se pudieron obtener las citas');
        }

        // Transformar los datos de la API
        const citasFormateadas = data.data.map(cita => {
            // Normalizar el estado
            let estado = cita.estado.toLowerCase();
            if (estado === 'completada') estado = 'finalizada';
            
            return {
                id: cita.id_cita,
                fecha: new Date(cita.fecha).toLocaleDateString('es-ES'),
                hora: cita.hora.substring(0, 5),
                doctor: cita.nombre_medico,
                especialidad: cita.especialidad,
                motivo: cita.motivo || 'Consulta médica',
                idCita: `CT-${cita.id_cita.toString().padStart(3, '0')}`,
                notas: cita.notas || 'Sin notas adicionales',
                estado: estado, // Usar el estado normalizado
                tipo: cita.tipo || 'Consulta'
            };
        });

        mostrarCitas(citasFormateadas);
        mostrarTratamientos([]);
        
    } catch (error) {
        console.error('Error al cargar datos del paciente:', error);
        document.getElementById('citasContenido').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error al cargar el historial: ${error.message}
            </div>
        `;
    }
}

// Función para mostrar citas (con lógica de estados mejorada)
function mostrarCitas(citas) {
    const citasContenido = document.getElementById('citasContenido');
    const noCitasMessage = document.getElementById('noCitasMessage');

    // Verificar si los elementos existen
    if (!citasContenido || !noCitasMessage) {
        console.error('Elementos del DOM no encontrados');
        return;
    }
    
    if (citas.length === 0) {
        noCitasMessage.style.display = 'block';
        citasContenido.innerHTML = '';
        return;
    }

    
    
    noCitasMessage.style.display = 'none';
    
    let html = '';
    citas.forEach(cita => {
        const estadoNormalizado = cita.estado.toLowerCase();

        // Mapeo de estados a clases y textos legibles
        const estadoInfo = {
            'pendiente': { class: 'warning', text: 'Pendiente' },
            'finalizada': { class: 'success', text: 'Finalizada' },
            'no_asistio': { class: 'danger', text: 'No asistió' },
            'completada': { class: 'success', text: 'Finalizada' } // Alias para compatibilidad
        }[estadoNormalizado] || { class: 'secondary', text: cita.estado };
        
        html += `
            <div class="card mb-3 border-0 shadow-sm cita-item" data-estado="${estadoNormalizado}">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="far fa-calendar-alt text-primary me-2"></i>
                        ${cita.fecha} | 
                        <i class="far fa-clock text-primary me-2"></i>
                        ${cita.hora}
                        <span class="badge bg-light text-dark ms-2">${cita.tipo}</span>
                    </h5>
                    <span class="badge bg-${estadoInfo.class}">${estadoInfo.text}</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1"><strong><i class="fas fa-user-md text-primary me-2"></i>Doctor:</strong> ${cita.doctor}</p>
                            <p class="mb-1"><strong><i class="fas fa-stethoscope text-primary me-2"></i>Especialidad:</strong> ${cita.especialidad}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong><i class="fas fa-notes-medical text-primary me-2"></i>Motivo:</strong> ${cita.motivo}</p>
                            <p class="mb-1"><strong><i class="fas fa-id-card text-primary me-2"></i>ID Cita:</strong> ${cita.idCita}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h6><i class="fas fa-file-medical text-primary me-2"></i>Notas:</h6>
                        <p class="text-muted">${cita.notas}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    citasContenido.innerHTML = html;
    
    // Agregar event listeners a los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            // Filtrar citas
            filtrarCitas(this.getAttribute('data-filter'));
        });
    });
}

// Función para filtrar citas
function filtrarCitas(filter) {
    const citas = document.querySelectorAll('.cita-item');
    const noCitasMessage = document.getElementById('noCitasMessage');
    
    if (!citas.length || !noCitasMessage) return;
    
    let hasVisibleItems = false;
    
    citas.forEach(cita => {
        const estado = cita.getAttribute('data-estado');
        if (filter === 'all' || estado === filter) {
            cita.style.display = '';
            hasVisibleItems = true;
        } else {
            cita.style.display = 'none';
        }
    });
    
    noCitasMessage.style.display = hasVisibleItems ? 'none' : 'block';
}

function mostrarTratamientos(tratamientos) {
    const tratamientosContenido = document.getElementById('tratamientosContenido');
    const noTratamientosMessage = document.getElementById('noTratamientosMessage');
    
    if (tratamientos.length === 0) {
        noTratamientosMessage.style.display = 'block';
        tratamientosContenido.innerHTML = '';
        return;
    }
    
    noTratamientosMessage.style.display = 'none';
    
    let html = '';
    tratamientos.forEach(tratamiento => {
        const estadoClass = {
            'Completado': 'success',
            'En curso': 'primary',
            'Suspendido': 'danger'
        }[tratamiento.estado] || 'secondary';
        
        html += `
            <div class="card mb-3 border-0 shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="fas fa-pills text-primary me-2"></i>
                        ${tratamiento.nombre}
                    </h5>
                    <span class="badge bg-${estadoClass}">${tratamiento.estado}</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-1"><strong><i class="far fa-calendar-alt text-primary me-2"></i>Fecha:</strong> 
                                ${tratamiento.fechaInicio} - ${tratamiento.fechaFin}
                            </p>
                            <p class="mb-1"><strong><i class="fas fa-user-md text-primary me-2"></i>Prescrito por:</strong> ${tratamiento.prescritoPor}</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-1"><strong><i class="fas fa-prescription-bottle-alt text-primary me-2"></i>Dosis:</strong> ${tratamiento.dosis}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h6><i class="fas fa-info-circle text-primary me-2"></i>Indicaciones:</h6>
                        <p class="text-muted">${tratamiento.indicaciones}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    tratamientosContenido.innerHTML = html;
}
