document.addEventListener('DOMContentLoaded', function() {
    // Variables para almacenar las instancias de los gráficos
    let citasChartInstance = null;
    let enfermedadesChartInstance = null;
    let tratamientosChartInstance = null;

    // Configurar eventos para los botones de Tendencia
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.closest('.filtros-section').id;
            
            if (sectionId === 'filtrosCitas') {
                mostrarTendenciasCitas();
            } else if (sectionId === 'filtrosEnfermedades') {
                mostrarTendenciasEnfermedades();
            } else if (sectionId === 'filtrosTratamientos') {
                mostrarTendenciasTratamientos();
            }
        });
    });

    // Cerrar popups
    document.querySelectorAll('.close-popup').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.custom-popup').forEach(popup => {
                popup.style.display = 'none';
            });
        });
    });

    // Manejar cambio de tipo de gráfico
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.popup-content');
            const chartType = this.getAttribute('data-type');
            const canvasId = parent.querySelector('canvas').id;
            const ctx = document.getElementById(canvasId).getContext('2d');
            
            // Actualizar botones activos
            parent.querySelectorAll('.chart-type-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Actualizar gráfico según el popup
            if (canvasId === 'citasChart') {
                if (citasChartInstance) citasChartInstance.destroy();
                citasChartInstance = crearChart(ctx, chartType, getCitasData(chartType));
            } else if (canvasId === 'enfermedadesChart') {
                if (enfermedadesChartInstance) enfermedadesChartInstance.destroy();
                enfermedadesChartInstance = crearChart(ctx, chartType, getEnfermedadesData(chartType));
            } else if (canvasId === 'tratamientosChart') {
                if (tratamientosChartInstance) tratamientosChartInstance.destroy();
                tratamientosChartInstance = crearChart(ctx, chartType, getTratamientosData(chartType));
            }
        });
    });

    // Función para crear un nuevo gráfico
    function crearChart(ctx, chartType, data) {
        return new Chart(ctx, {
            type: chartType,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: chartType !== 'pie' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        });
    }

    // Funciones para obtener datos de Citas
    function getCitasData(chartType) {
        if (chartType === 'pie') {
            return {
                labels: ['Pendientes', 'Finalizadas', 'No asistieron'],
                datasets: [{
                    label: 'Citas',
                    data: [45, 35, 20],
                    backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            };
        } else {
            return {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
                datasets: [{
                    label: 'Citas por mes',
                    data: [15, 22, 18, 25, 20],
                    backgroundColor: '#0d6efd',
                    borderColor: '#0a58ca',
                    borderWidth: 1
                }]
            };
        }
    }

    // Funciones para obtener datos de Enfermedades
    function getEnfermedadesData(chartType) {
        if (chartType === 'pie') {
            return {
                labels: ['Hipertensión', 'Diabetes', 'Asma', 'Dermatitis'],
                datasets: [{
                    label: 'Enfermedades',
                    data: [30, 25, 20, 25],
                    backgroundColor: ['#17A2B8', '#6F42C1', '#20C997', '#FD7E14'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            };
        } else {
            return {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
                datasets: [{
                    label: 'Enfermedades por mes',
                    data: [12, 19, 15, 22, 18],
                    backgroundColor: '#17A2B8',
                    borderColor: '#138496',
                    borderWidth: 1
                }]
            };
        }
    }

    // Funciones para obtener datos de Tratamientos
    function getTratamientosData(chartType) {
        if (chartType === 'pie') {
            return {
                labels: ['Metformina', 'Lisinopril', 'Salbutamol', 'Crema dermatológica'],
                datasets: [{
                    label: 'Tratamientos',
                    data: [40, 30, 15, 15],
                    backgroundColor: ['#6610F2', '#E83E8C', '#6F42C1', '#20C997'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            };
        } else {
            return {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
                datasets: [{
                    label: 'Tratamientos por mes',
                    data: [18, 24, 16, 22, 19],
                    backgroundColor: '#6610F2',
                    borderColor: '#520dc2',
                    borderWidth: 1
                }]
            };
        }
    }

    // Funciones para mostrar tendencias
    function mostrarTendenciasCitas() {
        const popup = document.getElementById('tendenciasCitasPopup');
        popup.style.display = 'flex';
        
        const ctx = document.getElementById('citasChart').getContext('2d');
        if (citasChartInstance) citasChartInstance.destroy();
        citasChartInstance = crearChart(ctx, 'pie', getCitasData('pie'));
    }

    function mostrarTendenciasEnfermedades() {
        const popup = document.getElementById('tendenciasEnfermedadesPopup');
        popup.style.display = 'flex';
        
        const ctx = document.getElementById('enfermedadesChart').getContext('2d');
        if (enfermedadesChartInstance) enfermedadesChartInstance.destroy();
        enfermedadesChartInstance = crearChart(ctx, 'pie', getEnfermedadesData('pie'));
    }

    function mostrarTendenciasTratamientos() {
        const popup = document.getElementById('tendenciasTratamientosPopup');
        popup.style.display = 'flex';
        
        const ctx = document.getElementById('tratamientosChart').getContext('2d');
        if (tratamientosChartInstance) tratamientosChartInstance.destroy();
        tratamientosChartInstance = crearChart(ctx, 'pie', getTratamientosData('pie'));
    }
});