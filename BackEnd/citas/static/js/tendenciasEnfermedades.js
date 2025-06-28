document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let enfermedadesChart = null;
    let currentChartType = 'pie';
    let chartData = null;

    // Elementos del DOM
    const btnTendencia = document.getElementById('btnTendencia');
    const popup = document.getElementById('tendenciasEnfermedadesPopup');
    const closeButtons = document.querySelectorAll('.close-popup');
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    const chartCanvas = document.getElementById('enfermedadesChart');
    const chartInfoContent = document.getElementById('chartInfoContent');

    // Evento para el botón Tendencia
    btnTendencia.addEventListener('click', function() {
        const enfermedadId = document.getElementById('selectEnfermedad').value;
        const pacienteUsername = window.obtenerPacienteUsername();
        
        if (!enfermedadId && !pacienteUsername) {
            alert('Por favor seleccione una enfermedad o ingrese un paciente primero');
            return;
        }

        // Obtener datos para los gráficos
        obtenerDatosParaGraficos(enfermedadId, pacienteUsername);
    });

    // Eventos para cerrar el popup
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            popup.style.display = 'none';
        });
    });

    // Cambiar tipo de gráfico
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentChartType = this.getAttribute('data-type');
            
            // Actualizar botones activos
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Redibujar el gráfico
            if (chartData) {
                renderChart(chartData, currentChartType);
            }
        });
    });

    // Función para obtener datos para los gráficos
    // Función para obtener datos para los gráficos (versión mejorada)
    // Función para obtener datos para los gráficos (versión corregida)
    function obtenerDatosParaGraficos(enfermedadId, pacienteUsername) {
        // Mostrar loading
        popup.style.display = 'block';
        chartInfoContent.innerHTML = '<p>Cargando datos...</p>';
        
        // Construir URL según los filtros - versión corregida
        let url = '/datos_tendencias_enfermedades/?';
        let params = [];
        
        if (enfermedadId) {
            params.push(`enfermedad_id=${enfermedadId}`);
        }
        
        if (pacienteUsername) {
            params.push(`paciente_username=${encodeURIComponent(pacienteUsername)}`);
        }
        
        url += params.join('&');

        // Mostrar mensaje de carga en el gráfico
        chartInfoContent.innerHTML = '<p>Obteniendo datos del servidor...</p>';
        
        // Obtener datos del servidor con manejo mejorado de errores
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!data || !data.success) {
                    throw new Error(data?.message || 'Datos recibidos no válidos');
                }
                
                return data;
            } catch (error) {
                console.error('Error en la solicitud:', error);
                throw error;
            }
        };

        // Usar Promise.race con timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tiempo de espera agotado (10 segundos)')), 10000)
        );

        Promise.race([fetchData(), timeoutPromise])
            .then(data => {
                chartData = data;
                renderChart(data, currentChartType);
                updateChartInfo(data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                
                let errorMessage = 'Error al conectar con el servidor';
                if (error.message.includes('HTTP')) {
                    errorMessage = `Error del servidor: ${error.message}`;
                } else if (error.message.includes('tiempo')) {
                    errorMessage = 'El servidor está tardando demasiado en responder';
                }
                
                chartInfoContent.innerHTML = `
                    <div class="alert alert-danger">
                        <h5>${errorMessage}</h5>
                        <p>Detalles: ${error.message}</p>
                        <p class="small text-muted">URL: ${url}</p>
                        <button class="btn btn-sm btn-secondary" onclick="window.location.reload()">Reintentar</button>
                    </div>
                `;
            });
    }

    // Función para renderizar el gráfico
    function renderChart(data, chartType) {
        // Destruir gráfico anterior si existe
        if (enfermedadesChart) {
            enfermedadesChart.destroy();
        }

        const ctx = chartCanvas.getContext('2d');
        let config = {};

        switch(chartType) {
            case 'pie':
                config = getPieChartConfig(data);
                break;
            case 'bar':
                config = getBarChartConfig(data);
                break;
            case 'line':
                config = getLineChartConfig(data);
                break;
            default:
                config = getPieChartConfig(data);
        }

        enfermedadesChart = new Chart(ctx, config);
    }

    // Configuración para gráfico de pastel
    function getPieChartConfig(data) {
        return {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: data.title,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        };
    }

    // Configuración para gráfico de barras
    function getBarChartConfig(data) {
        return {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Cantidad',
                    data: data.values,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: data.title,
                        font: {
                            size: 16
                        }
                    }
                }
            }
        };
    }

    // Configuración para gráfico de líneas
    function getLineChartConfig(data) {
        return {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Casos',
                    data: data.values,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de casos'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses del año'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: data.title,
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Casos: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        };
    }

    // Función para actualizar la información del gráfico
    function updateChartInfo(data) {
        let infoHTML = `<h4>${data.title}</h4>`;
        
        if (data.enfermedad_info) {
            infoHTML += `<p><strong>Enfermedad:</strong> ${data.enfermedad_info.nombre}</p>`;
            infoHTML += `<p><strong>Total pacientes en el período:</strong> ${data.enfermedad_info.total_pacientes}</p>`;
        }
        
        if (data.paciente_info) {
            infoHTML += `<p><strong>Paciente:</strong> ${data.paciente_info.nombre}</p>`;
            infoHTML += `<p><strong>Registros en el período:</strong> ${data.paciente_info.total_registros}</p>`;
        }
        
        const today = new Date();
        infoHTML += `<p><strong>Periodo analizado:</strong> Enero ${today.getFullYear()} - ${getCurrentMonthName()}</p>`;
        
        chartInfoContent.innerHTML = infoHTML;
    }

    // Función auxiliar para obtener el nombre del mes actual en español
    function getCurrentMonthName() {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[new Date().getMonth()];
    }

});