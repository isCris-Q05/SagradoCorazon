/**
 * document.addEventListener('DOMContentLoaded', function() {
    const buscarEnfermedad = document.getElementById('buscarEnfermedad');
    const sugerenciasEnfermedad = document.getElementById('sugerenciasEnfermedad');
    const buscarPaciente = document.getElementById('buscarPaciente');
    const sugerenciasPaciente = document.getElementById('sugerenciasPaciente');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnTendencia = document.getElementById('btnTendencia');

    // Búsqueda dinámica de enfermedades
    buscarEnfermedad.addEventListener('input', function() {
        const term = this.value.trim();
        if (term.length < 2) {
            sugerenciasEnfermedad.innerHTML = '';
            sugerenciasEnfermedad.style.display = 'none';
            return;
        }

        fetch(`/buscar/enfermedades/?term=${encodeURIComponent(term)}`)
            .then(response => response.json())
            .then(data => {
                sugerenciasEnfermedad.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(enfermedad => {
                        const item = document.createElement('a');
                        item.href = '#';
                        item.className = 'list-group-item list-group-item-action';
                        item.textContent = enfermedad.nombre;
                        item.dataset.id = enfermedad.id_enfermedad;
                        item.addEventListener('click', function(e) {
                            e.preventDefault();
                            buscarEnfermedad.value = enfermedad.nombre;
                            sugerenciasEnfermedad.style.display = 'none';
                            // Aquí puedes guardar el ID si lo necesitas
                        });
                        sugerenciasEnfermedad.appendChild(item);
                    });
                    sugerenciasEnfermedad.style.display = 'block';
                } else {
                    const item = document.createElement('a');
                    item.className = 'list-group-item';
                    item.textContent = 'No se encontraron resultados';
                    sugerenciasEnfermedad.appendChild(item);
                    sugerenciasEnfermedad.style.display = 'block';
                }
            });
    });

    // Búsqueda dinámica de pacientes
    buscarPaciente.addEventListener('input', function() {
        const term = this.value.trim();
        if (term.length < 2) {
            sugerenciasPaciente.innerHTML = '';
            sugerenciasPaciente.style.display = 'none';
            return;
        }

        fetch(`/buscar/pacientes/?term=${encodeURIComponent(term)}`)
            .then(response => response.json())
            .then(data => {
                sugerenciasPaciente.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(paciente => {
                        const item = document.createElement('a');
                        item.href = '#';
                        item.className = 'list-group-item list-group-item-action';
                        item.innerHTML = `
                            <div>${paciente.text}</div>
                            <small class="text-muted">Cédula: ${paciente.cedula}</small>
                        `;
                        item.dataset.id = paciente.id;
                        item.addEventListener('click', function(e) {
                            e.preventDefault();
                            buscarPaciente.value = paciente.text;
                            sugerenciasPaciente.style.display = 'none';
                            // Aquí puedes guardar el ID si lo necesitas
                        });
                        sugerenciasPaciente.appendChild(item);
                    });
                    sugerenciasPaciente.style.display = 'block';
                } else {
                    const item = document.createElement('a');
                    item.className = 'list-group-item';
                    item.textContent = 'No se encontraron resultados';
                    sugerenciasPaciente.appendChild(item);
                    sugerenciasPaciente.style.display = 'block';
                }
            });
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!buscarEnfermedad.contains(e.target)) {
            sugerenciasEnfermedad.style.display = 'none';
        }
        if (!buscarPaciente.contains(e.target)) {
            sugerenciasPaciente.style.display = 'none';
        }
    });

    // Botón Buscar
    btnBuscar.addEventListener('click', function() {
        const enfermedad = buscarEnfermedad.value;
        const paciente = buscarPaciente.value;
        
        // Aquí puedes implementar la lógica de búsqueda combinada
        console.log('Buscando con:', { enfermedad, paciente });
    });

    // Botón Tendencia
    btnTendencia.addEventListener('click', function() {
        // Implementa la lógica para mostrar enfermedades más comunes
        console.log('Mostrando tendencias');
    });
});
 * 
 */