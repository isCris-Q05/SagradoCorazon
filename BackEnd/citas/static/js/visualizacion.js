document.addEventListener('DOMContentLoaded', function() {
  // Referencias a los botones y secciones
  const mostrarCitasBtn = document.getElementById('mostrarCitasBtn');
  const mostrarEnfermedadesBtn = document.getElementById('mostrarEnfermedadesBtn');
  const mostrarTratamientosBtn = document.getElementById('mostrarTratamientosBtn');
  const seccionesFiltros = document.querySelectorAll('.filtros-section');

  // Función para ocultar todos los filtros
  function ocultarTodosLosFiltros() {
    seccionesFiltros.forEach(seccion => {
      seccion.style.display = 'none';
    });
  }

  // Mostrar filtros de Citas
  mostrarCitasBtn.addEventListener('click', function() {
    ocultarTodosLosFiltros();
    document.getElementById('filtrosCitas').style.display = 'block';
  });

  // Mostrar filtros de Enfermedades
  mostrarEnfermedadesBtn.addEventListener('click', function() {
    ocultarTodosLosFiltros();
    document.getElementById('filtrosEnfermedades').style.display = 'block';
  });

  // Mostrar filtros de Tratamientos
  mostrarTratamientosBtn.addEventListener('click', function() {
    ocultarTodosLosFiltros();
    document.getElementById('filtrosTratamientos').style.display = 'block';
  });

  // Agregar evento a todos los botones de Tendencia
    document.querySelectorAll('.filtros-section .btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.closest('.filtros-section').id;
            let tipo = '';
            
            if (sectionId === 'filtrosCitas') tipo = 'citas';
            else if (sectionId === 'filtrosEnfermedades') tipo = 'enfermedades';
            else if (sectionId === 'filtrosTratamientos') tipo = 'tratamientos';
            
            console.log(`Mostrar tendencias de ${tipo}`);
            // Aquí puedes agregar la lógica para mostrar las tendencias
            // Por ejemplo: mostrar gráficos, estadísticas, etc.
        });
    });
});