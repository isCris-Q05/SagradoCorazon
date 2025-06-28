document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los datos de enfermedades (para tabla y select)
    // Mostrar spinner o indicador de carga
    const tablaEnfermedades = document.getElementById('tabla-enfermedades');
    tablaEnfermedades.classList.add('d-none'); // Ocultar tabla inicialmente
    function cargarEnfermedades() {
        // Mostrar loading si es necesario
        // document.getElementById('loading-enfermedades').style.display = 'block';
        
        fetch('/enfermedades_cantidad_pacientes/')
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener los datos');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarEnfermedades(data.enfermedades);
                    
                    // Control de visibilidad más estricto
                    const tabla = document.getElementById('tabla-enfermedades');
                    const mensaje = document.getElementById('no-enfermedades-message');
                    
                    if (data.enfermedades?.length > 0) {
                        tabla.classList.remove('d-none');
                        mensaje.classList.add('d-none');
                    } else {
                        tabla.classList.add('d-none');
                        mensaje.classList.remove('d-none');
                    }
                    
                    poblarSelectEnfermedades(data.enfermedades);
                    document.getElementById('filtrosEnfermedades').classList.remove('d-none');
                } else {
                    throw new Error(data.message || 'Error en los datos recibidos');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError(error.message);
            })
            .finally(() => {
                // document.getElementById('loading-enfermedades').style.display = 'none';
            });
    }
    // Función para mostrar las enfermedades en la tabla
    function mostrarEnfermedades(enfermedades) {
        const tbody = document.querySelector('#tabla-enfermedades-datos tbody');
        tbody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos datos

        enfermedades.forEach(enfermedad => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${enfermedad.id}</td>
                <td>${enfermedad.nombre}</td>
                <td>${enfermedad.pacientes_directos}</td>
                <td>${enfermedad.pacientes_en_registros}</td>
                <td>${enfermedad.total_pacientes}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Función para poblar el select con las enfermedades
    function poblarSelectEnfermedades(enfermedades) {
        const select = document.getElementById('selectEnfermedad');
        select.innerHTML = ''; // Limpiar el select
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione una enfermedad';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        
        // Ordenar enfermedades alfabéticamente por nombre (solo para el select)
        const enfermedadesOrdenadas = [...enfermedades].sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        // Agregar cada enfermedad como opción
        enfermedadesOrdenadas.forEach(enfermedad => {
            const option = document.createElement('option');
            option.value = enfermedad.id;
            option.textContent = `${enfermedad.nombre} (${enfermedad.total_pacientes} pacientes)`;
            select.appendChild(option);
        });
    }

    // Función para mostrar errores
    function mostrarError(mensaje) {
        alert(mensaje);
        
        // Mostrar mensaje de error en el select también
        const select = document.getElementById('selectEnfermedad');
        select.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.textContent = mensaje;
        option.disabled = true;
        option.selected = true;
        select.appendChild(option);
    }

    // Función para ver detalles
    window.verDetallesEnfermedad = function(id) {
        alert(`Mostrando detalles para enfermedad ID: ${id}`);
        // Aquí puedes redirigir a otra página o mostrar un modal con más detalles
    };

    // Llamar a la función de carga cuando sea necesario
    cargarEnfermedades();
});