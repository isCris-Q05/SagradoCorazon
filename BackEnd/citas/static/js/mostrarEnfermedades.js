document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los datos de enfermedades (para tabla y select)
    function cargarEnfermedades() {
        fetch('/enfermedades_cantidad_pacientes/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Mostrar enfermedades en la tabla
                    mostrarEnfermedades(data.enfermedades);
                    document.getElementById('tabla-enfermedades').style.display = 'block';
                    
                    // Poblar el select de enfermedades
                    poblarSelectEnfermedades(data.enfermedades);
                    document.getElementById('filtrosEnfermedades').style.display = 'block';
                } else {
                    console.error('Error en los datos recibidos:', data.message);
                    mostrarError('Error al cargar los datos de enfermedades');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al conectar con el servidor');
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
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetallesEnfermedad(${enfermedad.id})">
                        Detalles
                    </button>
                </td>
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