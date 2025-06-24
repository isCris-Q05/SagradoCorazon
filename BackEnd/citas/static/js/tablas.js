document.addEventListener('DOMContentLoaded', function() {
    // Ocultar todas las tablas excepto la de citas al inicio
    document.querySelectorAll('.tabla-seccion').forEach(tabla => {
        if (tabla.id !== 'tabla-citas') {
            tabla.style.display = 'none';
        } else {
            tabla.style.display = 'block'; // Asegurarse que la de citas está visible
        }
    });

    // Mostrar tabla correspondiente al filtro seleccionado
    document.getElementById('mostrarCitasBtn').addEventListener('click', function() {
        cambiarTabla('citas');
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

    // Manejar búsquedas (ejemplo para citas)
    document.querySelector('#filtrosCitas .btn-primary').addEventListener('click', function() {
        const estado = document.querySelector('#filtrosCitas select').value;
        const fecha = document.querySelector('#filtrosCitas input[type="date"]').value;
        const medico = document.querySelectorAll('#filtrosCitas select')[1].value;
        
        console.log('Filtrando citas con:', {estado, fecha, medico});
        // Aquí iría la lógica AJAX para filtrar
    });

    // Similar para enfermedades y tratamientos...
    document.querySelector('#filtrosEnfermedades .btn-primary').addEventListener('click', function() {
        const nombre = document.querySelector('#filtrosEnfermedades input[type="text"]').value;
        const paciente = document.querySelector('#filtrosEnfermedades select').value;
        
        console.log('Filtrando enfermedades con:', {nombre, paciente});
    });

    document.querySelector('#filtrosTratamientos .btn-primary').addEventListener('click', function() {
        const nombre = document.querySelector('#filtrosTratamientos input[type="text"]').value;
        const enfermedad = document.querySelectorAll('#filtrosTratamientos select')[0].value;
        const paciente = document.querySelectorAll('#filtrosTratamientos select')[1].value;
        
        console.log('Filtrando tratamientos con:', {nombre, enfermedad, paciente});
    });
});