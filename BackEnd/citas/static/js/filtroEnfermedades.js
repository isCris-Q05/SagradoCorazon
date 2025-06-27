document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnBuscar = document.getElementById('btnBuscar');
    const btnVolver = document.getElementById('btn-volver-enfermedades');
    const selectEnfermedad = document.getElementById('selectEnfermedad');
    const inputPaciente = document.getElementById('buscarPaciente');
    const tablaEnfermedades = document.getElementById('tabla-enfermedades');
    const resultadosBusqueda = document.getElementById('resultados-busqueda');
    
    // Evento para el botón Buscar
    btnBuscar.addEventListener('click', function() {
        const enfermedadId = selectEnfermedad.value;
        // Obtener el username en lugar del nombre mostrado
        const pacienteUsername = window.obtenerPacienteUsername();
        const pacienteNombreMostrado = inputPaciente.value.trim();
        
        if (!enfermedadId && !pacienteUsername) {
            alert('Por favor seleccione una enfermedad o ingrese un paciente');
            return;
        }
        
        buscarEnfermedades(enfermedadId, pacienteUsername, pacienteNombreMostrado);
    });
    
    // Evento para el botón Volver
    btnVolver.addEventListener('click', function() {
        tablaEnfermedades.style.display = 'block';
        resultadosBusqueda.style.display = 'none';
    });
    
    // Función para realizar la búsqueda
    function buscarEnfermedades(enfermedadId, pacienteUsername, pacienteNombreMostrado) {
        // Mostrar loading
        resultadosBusqueda.style.display = 'block';
        tablaEnfermedades.style.display = 'none';
        document.querySelector('#tabla-resultados tbody').innerHTML = '<tr><td colspan="4" class="text-center">Cargando...</td></tr>';
        
        // Construir URL con parámetros
        let url = '/filtro_enfermedades/?';
        let enfermedadNombre = 'Ninguna';
        
        if (enfermedadId) {
            enfermedadNombre = selectEnfermedad.options[selectEnfermedad.selectedIndex].text.split(' (')[0];
            url += `nombre_enfermedad=${encodeURIComponent(enfermedadNombre)}&`;
        }
        
        if (pacienteUsername) {
            url += `paciente_username=${encodeURIComponent(pacienteUsername)}`;
        }
        
        // Actualizar resumen (usamos el nombre mostrado para el resumen)
        document.getElementById('resumen-enfermedad').textContent = enfermedadNombre;
        document.getElementById('resumen-paciente').textContent = pacienteNombreMostrado || 'Ninguno';
        document.getElementById('resumen-total').textContent = '...';
        
        // Realizar la petición
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarResultados(data);
                } else {
                    mostrarError(data.message || 'Error al obtener los resultados');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al conectar con el servidor');
            });
    }
    
    // Función para mostrar los resultados
    function mostrarResultados(data) {
        const tbody = document.querySelector('#tabla-resultados tbody');
        tbody.innerHTML = '';
        
        // Actualizar resumen
        const totalMostrar = data.registros_paciente || data.total_registros || 0;
        document.getElementById('resumen-total').textContent = totalMostrar;
        
        // Mostrar mensaje si no hay registros
        if (!data.registros || data.registros.length === 0) {
            let mensaje = 'No se encontraron registros';
            if (data.enfermedad && data.enfermedad.nombre && inputPaciente.value.trim()) {
                mensaje = `No se encontraron registros de ${inputPaciente.value.trim()} con ${data.enfermedad.nombre}`;
            }
            tbody.innerHTML = `<tr><td colspan="4" class="text-center">${mensaje}</td></tr>`;
            return;
        }
        
        // Mostrar registros encontrados
        data.registros.forEach(registro => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${registro.id}</td>
                <td>${registro.motivo || 'Sin motivo especificado'}</td>
                <td>${registro.fecha ? formatFecha(registro.fecha) : 'Fecha no disponible'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetallesRegistro(${registro.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Función para mostrar errores
    function mostrarError(mensaje) {
        const tbody = document.querySelector('#tabla-resultados tbody');
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${mensaje}</td></tr>`;
    }
    
    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo = 'error') {
        // Implementar tu sistema de alertas preferido (Toast, SweetAlert, etc.)
        alert(mensaje);
    }
    
    // Función para formatear fecha
    function formatFecha(fechaStr) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
    }
});

// Función global para ver detalles de un registro
window.verDetallesRegistro = function(id) {
    // Implementar lógica para ver detalles
    window.location.href = `/registros/detalle/${id}/`;
};