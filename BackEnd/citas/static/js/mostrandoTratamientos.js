document.addEventListener('DOMContentLoaded', function() {
    // Cargar tratamientos al iniciar
    cargarTratamientos();

    // Evento cuando cambia el select de tratamientos
    document.getElementById('select-tratamientos').addEventListener('change', function() {
        const tratamientoId = this.value;
        cargarEnfermedadesPorTratamiento(tratamientoId);
    });

    // Evento cuando cambia el select de enfermedades
    document.getElementById('select-enfermedades').addEventListener('change', function() {
        filtrarTabla();
    });

    // Función para cargar enfermedades por tratamiento
    function cargarEnfermedadesPorTratamiento(tratamientoId) {
        const selectEnfermedades = document.getElementById('select-enfermedades');
        
        // Limpiar select (excepto la primera opción)
        while (selectEnfermedades.options.length > 1) {
            selectEnfermedades.remove(1);
        }
        
        if (!tratamientoId) {
            // Si no hay tratamiento seleccionado, permitir filtrar por todas las enfermedades
            selectEnfermedades.disabled = false;
            filtrarTabla();
            return;
        }
        
        // Mostrar loading
        selectEnfermedades.disabled = true;
        const loadingOption = document.createElement('option');
        loadingOption.textContent = 'Cargando...';
        loadingOption.disabled = true;
        selectEnfermedades.appendChild(loadingOption);
        
        fetch(`/enfermedades-por-tratamiento/?tratamiento_id=${tratamientoId}`)
            .then(response => response.json())
            .then(data => {
                // Eliminar opción de loading
                selectEnfermedades.remove(selectEnfermedades.options.length - 1);
                
                if (data.success) {
                    // Agregar enfermedades al select
                    data.enfermedades.forEach(enfermedad => {
                        const option = document.createElement('option');
                        option.value = enfermedad.id;
                        option.textContent = enfermedad.nombre;
                        selectEnfermedades.appendChild(option);
                    });
                    
                    selectEnfermedades.disabled = false;
                } else {
                    console.error('Error al cargar enfermedades:', data.message);
                    mostrarErrorSelect(selectEnfermedades, 'Error al cargar enfermedades');
                }
                
                filtrarTabla();
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarErrorSelect(selectEnfermedades, 'Error de conexión');
                filtrarTabla();
            });
    }
    

    // Función para mostrar errores en el select
    function mostrarErrorSelect(select, mensaje) {
        select.disabled = false;
        while (select.options.length > 1) {
            select.remove(1);
        }
        const errorOption = document.createElement('option');
        errorOption.textContent = mensaje;
        errorOption.disabled = true;
        select.appendChild(errorOption);
    }

    // Función para filtrar la tabla según los selects
    function filtrarTabla() {
        const tratamientoId = document.getElementById('select-tratamientos').value;
        const enfermedadId = document.getElementById('select-enfermedades').value;
        
        fetch('/estadisticas-tratamientos/')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let tratamientosFiltrados = data.tratamientos;
                    
                    // Filtrar por tratamiento si hay uno seleccionado
                    if (tratamientoId) {
                        tratamientosFiltrados = tratamientosFiltrados.filter(
                            t => t.id == tratamientoId
                        );
                    }
                    
                    // Filtrar por enfermedad si hay una seleccionada
                    if (enfermedadId) {
                        tratamientosFiltrados = tratamientosFiltrados.filter(
                            t => t.enfermedades.some(e => e.id == enfermedadId)
                        );
                    }
                    
                    actualizarTablaTratamientos(tratamientosFiltrados);
                }
            });
    }


    // Función para cargar los tratamientos
    function cargarTratamientos() {
        fetch('/estadisticas-tratamientos/')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    actualizarTablaTratamientos(data.tratamientos);
                    llenarSelectTratamientos(data.tratamientos); // Nueva función para llenar el select
                } else {
                    console.error('Error al cargar tratamientos:', data.message);
                    mostrarError('Error al cargar los tratamientos');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error de conexión con el servidor');
            });
    }

    // Función para llenar el select con los tratamientos
    function llenarSelectTratamientos(tratamientos) {
        const select = document.getElementById('select-tratamientos');
        
        // Limpiar select (excepto la primera opción)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Agregar opciones para cada tratamiento
        tratamientos.forEach(tratamiento => {
            const option = document.createElement('option');
            option.value = tratamiento.id;
            option.textContent = tratamiento.nombre;
            select.appendChild(option);
        });
    }

    // Función para actualizar la tabla con los datos
    function actualizarTablaTratamientos(tratamientos) {
        const tbody = document.querySelector('#tabla-tratamientos tbody');
        tbody.innerHTML = '';  // Limpiar tabla

        if (tratamientos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay tratamientos registrados</td></tr>';
            return;
        }

        tratamientos.forEach(tratamiento => {
            const row = document.createElement('tr');
            
            // Formatear enfermedades para mostrar
            const enfermedadesHTML = tratamiento.enfermedades.length > 0 
                ? tratamiento.enfermedades.map(e => 
                    `<span class="badge bg-secondary me-1">${e.nombre}</span>`
                  ).join('')
                : '<span class="text-muted">Ninguna</span>';

            row.innerHTML = `
                <td>${tratamiento.id}</td>
                <td>${tratamiento.nombre}</td>
                <td>${tratamiento.descripcion || 'Sin descripción'}</td>
                <td>${enfermedadesHTML}</td>
                <td>${tratamiento.total_pacientes}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-detalles" data-id="${tratamiento.id}">
                        Detalles
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Agregar eventos a los botones de detalles
        document.querySelectorAll('.btn-detalles').forEach(btn => {
            btn.addEventListener('click', function() {
                const tratamientoId = this.getAttribute('data-id');
                mostrarDetallesTratamiento(tratamientoId);
            });
        });
    }

    // Función para mostrar detalles de un tratamiento
    function mostrarDetallesTratamiento(tratamientoId) {
        console.log('Mostrar detalles del tratamiento:', tratamientoId);
        alert(`Detalles del tratamiento ID: ${tratamientoId}`);
    }

    // Función para mostrar errores
    function mostrarError(mensaje) {
        const tbody = document.querySelector('#tabla-tratamientos tbody');
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${mensaje}</td></tr>`;
    }

    
});