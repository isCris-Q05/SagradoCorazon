document.addEventListener('DOMContentLoaded', function() {
    // Variables para la paginación
    let todasLasCitas = [];
    let citasFiltradas = [];
    let paginaActual = 1;
    const citasPorPagina = 10;
    let totalPaginas = 1;
    let aplicandoFiltros = false;

    // Cargar médicos al iniciar
    cargarMedicos();

    // Ocultar todas las tablas excepto la de citas al inicio
    document.querySelectorAll('.tabla-seccion').forEach(tabla => {
        if (tabla.id !== 'tabla-citas') {
            tabla.style.display = 'none';
        } else {
            tabla.style.display = 'block';
            // Cargar citas al mostrar la tabla inicialmente
            cargarCitas();
        }
    });

    // Configurar eventos de paginación
    document.getElementById('btnAnterior').addEventListener('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarCitasPagina();
            actualizarPaginador();
        }
    });

    document.getElementById('btnSiguiente').addEventListener('click', function() {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarCitasPagina();
            actualizarPaginador();
        }
    });

    // Función para actualizar el estado del paginador
    function actualizarPaginador() {
        document.getElementById('paginaInfo').textContent = `Página ${paginaActual} de ${totalPaginas}`;
        
        // Habilitar/deshabilitar botones
        document.getElementById('btnAnterior').disabled = paginaActual <= 1;
        document.getElementById('btnSiguiente').disabled = paginaActual >= totalPaginas;
    }

    // Función para mostrar las citas de la página actual
    function mostrarCitasPagina() {
        const inicio = (paginaActual - 1) * citasPorPagina;
        const fin = inicio + citasPorPagina;
        const citasMostrar = aplicandoFiltros ? citasFiltradas : todasLasCitas;
        const citasPagina = citasMostrar.slice(inicio, fin);
        
        actualizarTablaCitas(citasPagina);
    }

    // Mostrar tabla correspondiente al filtro seleccionado
    document.getElementById('mostrarCitasBtn').addEventListener('click', function() {
        cambiarTabla('citas');
        if (todasLasCitas.length === 0) {
            cargarCitas();
        } else {
            mostrarCitasPagina();
        }
    });

    document.getElementById('mostrarEnfermedadesBtn').addEventListener('click', function() {
        cambiarTabla('enfermedades');
    });

    document.getElementById('mostrarTratamientosBtn').addEventListener('click', function() {
        cambiarTabla('tratamientos');
    });

    // Función para cambiar entre tablas
    function cambiarTabla(tipo) {
        // Ocultar todas las tablas
        document.querySelectorAll('.tabla-seccion').forEach(tabla => {
            tabla.style.display = 'none';
        });
        
        // Mostrar la tabla correspondiente
        const tablaMostrar = document.getElementById(`tabla-${tipo}`);
        if (tablaMostrar) {
            tablaMostrar.style.display = 'block';
        } else {
            console.error(`No se encontró la tabla con ID: tabla-${tipo}`);
        }
        
        // También mostramos los filtros correspondientes
        document.querySelectorAll('.filtros-section').forEach(filtro => {
            filtro.style.display = 'none';
        });
        const filtroMostrar = document.getElementById(`filtros${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (filtroMostrar) {
            filtroMostrar.style.display = 'block';
        }
    }

    // Función para cargar citas desde el endpoint
    async function cargarCitas() {
        try {
            const response = await fetch('http://127.0.0.1:8000/citas_visualizacion/');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`Total de citas: ${data.count}`);
                todasLasCitas = data.citas;
                citasFiltradas = [...todasLasCitas];
                totalPaginas = Math.ceil(todasLasCitas.length / citasPorPagina);
                paginaActual = 1;
                
                mostrarCitasPagina();
                actualizarPaginador();
            } else {
                console.error('La respuesta no fue exitosa');
            }
        } catch (error) {
            console.error('Error al obtener las citas:', error);
            mostrarErrorEnTabla('Error al cargar las citas. Intente nuevamente.');
        }
    }

    // Función para actualizar la tabla con los datos de las citas
    function actualizarTablaCitas(citas) {
        const tbody = document.querySelector('#tabla-citas tbody');
        tbody.innerHTML = ''; // Limpiar tabla
        
        if (citas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No hay citas registradas</td></tr>';
            return;
        }
        
        // Crear filas para cada cita
        citas.forEach(cita => {
            const row = document.createElement('tr');
            
            // Obtener solo la hora sin los segundos (formato HH:MM)
            const hora = typeof cita.hora === 'string' ? cita.hora.substring(0, 5) : cita.hora;
            
            // Determinar clase del badge según el estado
            let badgeClass = '';
            let estadoText = '';
            switch(cita.estado) {
                case 'pendiente':
                    badgeClass = 'bg-warning';
                    estadoText = 'Pendiente';
                    break;
                case 'finalizada':
                    badgeClass = 'bg-success';
                    estadoText = 'Finalizada';
                    break;
                case 'no_asistio':
                    badgeClass = 'bg-danger';
                    estadoText = 'No asistió';
                    break;
                default:
                    badgeClass = 'bg-secondary';
                    estadoText = cita.estado;
            }
            
            row.innerHTML = `
                <td>${cita.id_cita}</td>
                <td>${cita.paciente_nombre}</td>
                <td><span class="badge ${badgeClass}">${estadoText}</span></td>
                <td>${cita.fecha}</td>
                <td>${hora}</td>
                <td>${cita.medico_nombre}</td>
                <td><input class="form-check-input" type="checkbox"></td>
                <td>
                    <button class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#editCitaModal"
                        data-id="${cita.id_cita}"
                        data-paciente="${cita.id_paciente_id}"
                        data-estado="${cita.estado}"
                        data-fecha="${cita.fecha}"
                        data-hora="${hora}"
                        data-medico="${cita.id_medico_id}">
                        Editar
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Configurar eventos para los botones de editar
        configurarBotonesEditar();
    }

    // Función para configurar los eventos de los botones de editar
    function configurarBotonesEditar() {
        document.querySelectorAll('#tabla-citas .btn-outline-success').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Editando cita:', {
                    id: this.getAttribute('data-id'),
                    paciente: this.getAttribute('data-paciente'),
                    estado: this.getAttribute('data-estado'),
                    fecha: this.getAttribute('data-fecha'),
                    hora: this.getAttribute('data-hora'),
                    medico: this.getAttribute('data-medico')
                });
            });
        });
    }

    // Función para cargar citas filtradas por estado (finalizadas) y rango de fechas
    async function cargarCitasFiltradas() {
        try {
            const estado = document.getElementById('filtroEstado').value;
            const fechaInicio = document.getElementById('fechaInicio').value;
            const fechaFin = document.getElementById('fechaFin').value;
            const medico = document.getElementById('filtroMedico').value;

            // Construir la URL del endpoint
            let url = 'http://127.0.0.1:8000/citas_asistio/';
            
            // Agregar parámetros si existen
            const params = new URLSearchParams();
            
            if (fechaInicio && fechaFin) {
                // Extraer solo YYYY-MM de los inputs type="month"
                const inicio = fechaInicio.substring(0, 7);
                const fin = fechaFin.substring(0, 7);
                url = `${url}${inicio}/${fin}/`;
            } else if (estado === 'finalizada') {
                // Si no hay fechas pero se seleccionó "finalizada", traer todas
                url = 'http://127.0.0.1:8000/citas_asistio/';
            }
            
            if (medico) {
                params.append('medico_id', medico);
            }

            const fullUrl = `${url}?${params.toString()}`;
            console.log('Fetching URL:', fullUrl);
            
            const response = await fetch(fullUrl);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`Total de citas filtradas: ${data.count}`);
                citasFiltradas = data.citas.map(cita => ({
                    id_cita: cita.id,
                    paciente_nombre: cita.paciente.nombre,
                    estado: 'finalizada',
                    fecha: cita.fecha,
                    hora: cita.hora,
                    medico_nombre: cita.medico.nombre,
                    id_paciente_id: cita.paciente.id,
                    id_medico_id: cita.medico.id
                }));
                
                aplicandoFiltros = true;
                totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);
                paginaActual = 1;
                
                mostrarCitasPagina();
                actualizarPaginador();
            } else {
                console.error('La respuesta no fue exitosa:', data.message);
                mostrarErrorEnTabla(data.message || 'Error al filtrar citas');
            }
        } catch (error) {
            console.error('Error al obtener las citas filtradas:', error);
            mostrarErrorEnTabla('Error al cargar las citas. Intente nuevamente.');
        }
    }

    // Función para aplicar filtros locales (para estados que no son "finalizada")
    function aplicarFiltrosLocales() {
        const estado = document.getElementById('filtroEstado').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const medico = document.getElementById('filtroMedico').value;
        
        aplicandoFiltros = estado || fechaInicio || fechaFin || medico;
        
        citasFiltradas = todasLasCitas.filter(cita => {
            const cumpleEstado = !estado || cita.estado === estado;
            const cumpleMedico = !medico || cita.id_medico_id.toString() === medico;
            
            // Filtro por fecha (si se proporciona)
            let cumpleFecha = true;
            if (fechaInicio && fechaFin) {
                const fechaCita = new Date(cita.fecha);
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                fin.setDate(fin.getDate() + 1); // Incluir el día final
                
                cumpleFecha = fechaCita >= inicio && fechaCita <= fin;
            }
            
            return cumpleEstado && cumpleMedico && cumpleFecha;
        });
        
        totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);
        paginaActual = 1;
        mostrarCitasPagina();
        actualizarPaginador();
    }

    // Función para mostrar errores en la tabla
    function mostrarErrorEnTabla(mensaje) {
        const tbody = document.querySelector('#tabla-citas tbody');
        tbody.innerHTML = `<tr><td colspan="8">${mensaje}</td></tr>`;
    }

    // Configurar evento del botón de búsqueda
    document.getElementById('btnBuscarCitas').addEventListener('click', function() {
        const estado = document.getElementById('filtroEstado').value;
        
        if (estado === 'finalizada') {
            cargarCitasFiltradas();
        } else {
            aplicarFiltrosLocales();
        }
    });

    // Función para cargar médicos en el select
    async function cargarMedicos() {
        try {
            const response = await fetch('http://127.0.0.1:8000/doctores_all/');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`Total de médicos: ${data.count}`);
                poblarSelectMedicos(data.doctores);
            } else {
                console.error('La respuesta no fue exitosa');
            }
        } catch (error) {
            console.error('Error al obtener los médicos:', error);
        }
    }

    // Función para poblar el select con los médicos
    function poblarSelectMedicos(doctores) {
        const selectMedicos = document.getElementById('filtroMedico');
        
        // Limpiar opciones existentes (excepto la primera "Todos")
        while (selectMedicos.options.length > 1) {
            selectMedicos.remove(1);
        }
        
        // Ordenar médicos alfabéticamente por nombre
        doctores.sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        // Agregar cada médico como opción
        doctores.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.nombre;
            selectMedicos.appendChild(option);
        });
    }
});