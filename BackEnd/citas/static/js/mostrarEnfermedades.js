document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los datos de enfermedades
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
                    mostrarEnfermedades(data.enfermedades);
                    // Mostrar la tabla si estaba oculta
                    document.getElementById('tabla-enfermedades').style.display = 'block';
                } else {
                    console.error('Error en los datos recibidos:', data.message);
                    alert('Error al cargar los datos de enfermedades');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
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

    // Función para ver detalles
    window.verDetallesEnfermedad = function(id) {
        alert(`Mostrando detalles para enfermedad ID: ${id}`);
        // Aquí puedes redirigir a otra página o mostrar un modal con más detalles
    };

    // Llamar a la función de carga cuando sea necesario
    cargarEnfermedades();
});