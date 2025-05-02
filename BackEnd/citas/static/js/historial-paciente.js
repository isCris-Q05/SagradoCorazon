document.addEventListener('DOMContentLoaded', () => {
    const historialModal = document.getElementById('historialModal');
    
    if (historialModal) {
        historialModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            
            // Extraer datos del paciente
            const nombre = button.getAttribute('data-name') || 'N/A';
            const apellido = button.getAttribute('data-apellido') || 'Desconocido';
            const telefono = button.getAttribute('data-telefono') || 'No especificado';
            const pacienteId = button.getAttribute('data-paciente-id');
            
            // Actualizar información del paciente
            document.getElementById('historialNombrePaciente').textContent = `${nombre} ${apellido}`;
            document.getElementById('historialTelefono').textContent = `Teléfono: ${telefono}`;
            
            // Cargar datos del paciente
            cargarDatosPaciente(pacienteId);
        });
    }

    // Filtrado de citas
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filtrarCitas(filter);
        });
    });
});

function cargarDatosPaciente(pacienteId) {
    // Simulación de datos - reemplazar con llamadas AJAX reales
    const datosSimulados = {
        citas: [
            {
                id: 1,
                fecha: '15/04/2023',
                hora: '10:30',
                doctor: 'Dr. Martínez',
                especialidad: 'Cardiología',
                motivo: 'Revisión anual',
                idCita: 'CT-001',
                notas: 'Paciente con presión arterial estable. Se recomienda continuar con medicación actual y revisión en 6 meses.',
                estado: 'Completada',
                tipo: 'Consulta'
            },
            {
                id: 2,
                fecha: '23/06/2023',
                hora: '16:15',
                doctor: 'Dra. Rodríguez',
                especialidad: 'Dermatología',
                motivo: 'Consulta por alergia cutánea',
                idCita: 'CT-002',
                notas: 'Se identificó alergia a componente X. Se recetó antihistamínico y crema tópica.',
                estado: 'Completada',
                tipo: 'Consulta'
            },
            {
                id: 3,
                fecha: '20/10/2023',
                hora: '11:00',
                doctor: 'Dr. González',
                especialidad: 'Oftalmología',
                motivo: 'Control de vista',
                idCita: 'CT-004',
                notas: 'Paciente necesita nueva receta para lentes.',
                estado: 'Pendiente',
                tipo: 'Control'
            },
            {
                id: 4,
                fecha: '05/09/2023',
                hora: '14:00',
                doctor: 'Dra. Pérez',
                especialidad: 'Medicina General',
                motivo: 'Vacunación',
                idCita: 'CT-005',
                notas: 'Paciente no se presentó a la cita.',
                estado: 'No asistió',
                tipo: 'Procedimiento'
            }
        ],
        tratamientos: [
            {
                id: 1,
                nombre: 'Antihistamínico X',
                fechaInicio: '23/06/2023',
                fechaFin: '23/07/2023',
                dosis: '1 tableta cada 24 horas',
                indicaciones: 'Tomar con alimentos. Evitar manejar maquinaria pesada.',
                estado: 'Completado',
                prescritoPor: 'Dra. Rodríguez'
            },
            {
                id: 2,
                nombre: 'Crema tópica Y',
                fechaInicio: '23/06/2023',
                fechaFin: '30/06/2023',
                dosis: 'Aplicar en zona afectada 2 veces al día',
                indicaciones: 'No exponer al sol las zonas tratadas.',
                estado: 'Completado',
                prescritoPor: 'Dra. Rodríguez'
            },
            {
                id: 3,
                nombre: 'Medicamento para presión Z',
                fechaInicio: '15/04/2023',
                fechaFin: '15/10/2023',
                dosis: '1 tableta cada mañana',
                indicaciones: 'Controlar presión arterial semanalmente.',
                estado: 'En curso',
                prescritoPor: 'Dr. Martínez'
            }
        ]
    };

    // Mostrar citas
    mostrarCitas(datosSimulados.citas);
    
    // Mostrar tratamientos
    mostrarTratamientos(datosSimulados.tratamientos);
}

function mostrarCitas(citas) {
    const citasContenido = document.getElementById('citasContenido');
    const noCitasMessage = document.getElementById('noCitasMessage');
    
    if (citas.length === 0) {
        noCitasMessage.style.display = 'block';
        citasContenido.innerHTML = '';
        return;
    }
    
    noCitasMessage.style.display = 'none';
    
    let html = '';
    citas.forEach(cita => {
        const estadoClass = {
            'Completada': 'success',
            'Pendiente': 'warning',
            'No asistió': 'danger'
        }[cita.estado] || 'secondary';
        
        html += `
            <div class="card mb-3 border-0 shadow-sm cita-item" data-estado="${cita.estado}">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="far fa-calendar-alt text-primary me-2"></i>
                        ${cita.fecha} | 
                        <i class="far fa-clock text-primary me-2"></i>
                        ${cita.hora}
                        <span class="badge bg-light text-dark ms-2">${cita.tipo}</span>
                    </h5>
                    <span class="badge bg-${estadoClass}">${cita.estado}</span>
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

function filtrarCitas(filter) {
    const citas = document.querySelectorAll('.cita-item');
    let hasVisibleItems = false;
    
    citas.forEach(cita => {
        if (filter === 'all' || cita.getAttribute('data-estado') === filter) {
            cita.style.display = '';
            hasVisibleItems = true;
        } else {
            cita.style.display = 'none';
        }
    });
    
    document.getElementById('noCitasMessage').style.display = hasVisibleItems ? 'none' : 'block';
}