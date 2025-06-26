// tendencia.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables para almacenar las instancias de los gráficos
    let citasChartInstance = null;
    let citasActuales = []; // Variable para almacenar las citas que se están mostrando

    // Configurar eventos para los botones de Tendencia
    document.getElementById('btnTendenciaCitas').addEventListener('click', function() {
        // Verificar si hay datos filtrados
        const estado = document.getElementById('filtroEstado').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const medico = document.getElementById('filtroMedico').value;
        
        // Determinar si hay filtros aplicados
        const hayFiltros = estado || fechaInicio || fechaFin || medico;
        
        if (hayFiltros) {
            // Si hay filtros, usar citasFiltradas (si existen) o aplicar filtros
            if (window.citasFiltradas && window.citasFiltradas.length > 0) {
                citasActuales = window.citasFiltradas;
                mostrarTendenciasCitas(window.citasFiltradas);
            } else {
                // Aplicar filtros locales si no están aplicados
                aplicarFiltrosLocales();
                citasActuales = window.citasFiltradas;
                mostrarTendenciasCitas(window.citasFiltradas);
            }
        } else {
            // Si no hay filtros, usar todas las citas
            citasActuales = window.todasLasCitas;
            mostrarTendenciasCitas(window.todasLasCitas);
        }
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
                citasChartInstance = crearChart(ctx, chartType, getCitasData(chartType, citasActuales));
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
                plugins: {
                    title: {
                        display: true,
                        text: data.chartTitle || 'Distribución de Citas',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: chartType !== 'pie' ? {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad de Citas'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: data.xAxisTitle || 'Meses'
                        }
                    }
                } : {}
            }
        });
    }

    // Función para obtener datos reales de Citas basados en los filtros
    function getCitasData(chartType, citas = []) {
        // Verificar si hay citas para mostrar
        if (!citas || citas.length === 0) {
            return {
                chartTitle: 'No hay datos disponibles',
                labels: ['Sin datos'],
                datasets: [{
                    label: 'Citas',
                    data: [1],
                    backgroundColor: ['#cccccc'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            };
        }

        const estadoFiltro = document.getElementById('filtroEstado').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const medicoFiltro = document.getElementById('filtroMedico').value;
        
        // Obtener título descriptivo basado en filtros
        let chartTitle = 'Distribución de Citas';
        if (estadoFiltro) chartTitle += ` - Estado: ${estadoFiltro.charAt(0).toUpperCase() + estadoFiltro.slice(1)}`;
        if (medicoFiltro) {
            const medicoSelect = document.getElementById('filtroMedico');
            const medicoNombre = medicoSelect.options[medicoSelect.selectedIndex].text;
            chartTitle += ` - Médico: ${medicoNombre}`;
        }
        if (fechaInicio && fechaFin) {
            chartTitle += ` - Período: ${fechaInicio} a ${fechaFin}`;
        }
        
        if (chartType === 'pie') {
            // Estadísticas por estado
            const estados = {
                pendiente: 0,
                finalizada: 0,
                no_asistio: 0
            };
            
            citas.forEach(cita => {
                estados[cita.estado] = (estados[cita.estado] || 0) + 1;
            });
            
            return {
                chartTitle: chartTitle,
                labels: ['Pendientes', 'Finalizadas', 'No asistieron'],
                datasets: [{
                    label: 'Citas por estado',
                    data: [estados.pendiente, estados.finalizada, estados.no_asistio],
                    backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            };
        } else {
            // Estadísticas por mes (solo si hay filtro de fecha)
            if (fechaInicio && fechaFin) {
                // Agrupar por mes
                const meses = {};
                const mesesLabels = [];
                const mesesData = [];
                
                // Obtener rango de meses
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                const current = new Date(inicio);
                
                while (current <= fin) {
                    const mesKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                    const mesLabel = `${current.toLocaleString('default', { month: 'short' })} ${current.getFullYear()}`;
                    
                    if (!meses[mesKey]) {
                        meses[mesKey] = 0;
                        mesesLabels.push(mesLabel);
                    }
                    
                    current.setMonth(current.getMonth() + 1);
                }
                
                // Contar citas por mes
                citas.forEach(cita => {
                    const fechaCita = new Date(cita.fecha);
                    const mesKey = `${fechaCita.getFullYear()}-${String(fechaCita.getMonth() + 1).padStart(2, '0')}`;
                    
                    if (meses[mesKey] !== undefined) {
                        meses[mesKey]++;
                    }
                });
                
                // Preparar datos para el gráfico
                for (const mesKey in meses) {
                    mesesData.push(meses[mesKey]);
                }
                
                return {
                    chartTitle: chartTitle,
                    xAxisTitle: 'Meses',
                    labels: mesesLabels,
                    datasets: [{
                        label: 'Citas por mes',
                        data: mesesData,
                        backgroundColor: '#0d6efd',
                        borderColor: '#0a58ca',
                        borderWidth: 1
                    }]
                };
            } else {
                // Si no hay rango de fechas, mostrar distribución por médico
                const medicos = {};
                
                citas.forEach(cita => {
                    if (!medicos[cita.medico_nombre]) {
                        medicos[cita.medico_nombre] = 0;
                    }
                    medicos[cita.medico_nombre]++;
                });
                
                return {
                    chartTitle: chartTitle,
                    xAxisTitle: 'Médicos',
                    labels: Object.keys(medicos),
                    datasets: [{
                        label: 'Citas por médico',
                        data: Object.values(medicos),
                        backgroundColor: '#0d6efd',
                        borderColor: '#0a58ca',
                        borderWidth: 1
                    }]
                };
            }
        }
    }

    // Función para mostrar tendencias de citas
    function mostrarTendenciasCitas(citas) {
        const popup = document.getElementById('tendenciasCitasPopup');
        popup.style.display = 'flex';
        
        const ctx = document.getElementById('citasChart').getContext('2d');
        if (citasChartInstance) citasChartInstance.destroy();
        
        // Determinar tipo de gráfico inicial basado en los filtros
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const tipoInicial = (fechaInicio && fechaFin) ? 'bar' : 'pie';
        
        // Activar el botón correspondiente
        const initialBtn = document.querySelector(`.chart-type-btn[data-type="${tipoInicial}"]`);
        if (initialBtn) {
            document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            initialBtn.classList.add('active');
        }
        
        citasChartInstance = crearChart(ctx, tipoInicial, getCitasData(tipoInicial, citas));
    }

    // Función para aplicar filtros locales
    function aplicarFiltrosLocales() {
        const estado = document.getElementById('filtroEstado').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const medico = document.getElementById('filtroMedico').value;
        
        window.aplicandoFiltros = estado || fechaInicio || fechaFin || medico;
        
        window.citasFiltradas = window.todasLasCitas.filter(cita => {
            const cumpleEstado = !estado || cita.estado === estado;
            const cumpleMedico = !medico || cita.id_medico_id.toString() === medico;
            
            let cumpleFecha = true;
            if (fechaInicio && fechaFin) {
                const fechaCita = new Date(cita.fecha);
                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);
                fin.setDate(fin.getDate() + 1);
                
                cumpleFecha = fechaCita >= inicio && fechaCita <= fin;
            }
            
            return cumpleEstado && cumpleMedico && cumpleFecha;
        });
    }
});