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
    // Función para realizar la búsqueda
    // Función para realizar la búsqueda
    function buscarEnfermedades(enfermedadId, pacienteUsername, pacienteNombreMostrado) {
        // Mostrar loading
        resultadosBusqueda.style.display = 'block';
        tablaEnfermedades.style.display = 'none';
        document.querySelector('#tabla-resultados tbody').innerHTML = '<tr><td colspan="4" class="text-center">Cargando...</td></tr>';
        
        // Construir URL con parámetros
        let url = '/filtro_enfermedades/?';
        
        if (enfermedadId) {
            url += `id_enfermedad=${enfermedadId}&`;
        }
        
        if (pacienteUsername) {
            url += `paciente_username=${encodeURIComponent(pacienteUsername)}`;
        }
        
        console.log("URL de búsqueda:", url); // Para depuración
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta del servidor');
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data); // Para depuración
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

    // Modificación del evento click del botón buscar
    btnBuscar.addEventListener('click', function() {
        const enfermedadId = selectEnfermedad.value;
        const paciente = window.pacienteSeleccionado; // Obtenemos el objeto completo
        
        if (!enfermedadId && !paciente) {
            alert('Por favor seleccione una enfermedad o ingrese un paciente');
            return;
        }
        
        buscarEnfermedades(
            enfermedadId, 
            paciente ? paciente.username : null, // Pasamos el username directamente
            paciente ? paciente.nombre : inputPaciente.value.trim()
        );
    });
    
    // Función para mostrar los resultados
    function mostrarResultados(data) {
        const tbody = document.querySelector('#tabla-resultados tbody');
        tbody.innerHTML = '';
        
        // Actualizar resumen
        const enfermedadNombre = data.enfermedad?.nombre || 'Ninguna seleccionada';
        const pacienteNombre = data.paciente?.nombre || inputPaciente.value.trim() || 'Ninguno seleccionado';
        const totalMostrar = data.registros_paciente || data.total_registros || 0;
        
        document.getElementById('resumen-enfermedad').textContent = enfermedadNombre;
        document.getElementById('resumen-paciente').textContent = pacienteNombre;
        document.getElementById('resumen-total').textContent = totalMostrar;
        
        // Mostrar mensaje si no hay registros
        if (!data.registros || data.registros.length === 0) {
            let mensaje = 'No se encontraron registros';
            if (enfermedadNombre !== 'Ninguna seleccionada' && pacienteNombre !== 'Ninguno seleccionado') {
                mensaje = `No se encontraron registros de ${pacienteNombre} con ${enfermedadNombre}`;
            }
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">${mensaje}</td></tr>`;
            return;
        }
        
        // Mostrar registros encontrados
        data.registros.forEach(registro => {
            const row = document.createElement('tr');
            
            // Crear badges para tratamientos
            let tratamientosHTML = '';
            if (registro.tratamientos && registro.tratamientos.length > 0) {
                tratamientosHTML = registro.tratamientos.map(t => 
                    `<span class="badge bg-info me-1">${t.nombre}</span>`
                ).join('');
            } else {
                tratamientosHTML = '<span class="text-muted">Ninguno</span>';
            }
            
            // Crear badges para productos
            let productosHTML = '';
            if (registro.productos && registro.productos.length > 0) {
                productosHTML = registro.productos.map(p => 
                    `<span class="badge bg-warning me-1">${p.nombre}</span>`
                ).join('');
            } else {
                productosHTML = '<span class="text-muted">Ninguno</span>';
            }
            
            // Estado de asistencia
            const asistenciaHTML = registro.asistencia ?
                '<span class="badge bg-success">Asistió</span>' :
                '<span class="badge bg-danger">No asistió</span>';
            
            row.innerHTML = `
                <td>${registro.id}</td>
                <td>${registro.motivo || 'Sin motivo especificado'}</td>
                <td>${registro.fecha ? formatFecha(registro.fecha) : 'Fecha no disponible'}</td>
                <td>${tratamientosHTML}</td>
                <td>${productosHTML}</td>
                <td>${asistenciaHTML}</td>
                
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