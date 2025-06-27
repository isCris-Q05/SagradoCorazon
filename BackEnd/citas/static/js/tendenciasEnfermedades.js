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
function obtenerDatosParaGraficos(enfermedadId, pacienteUsername) {
    // Mostrar loading
    popup.style.display = 'block';
    chartInfoContent.innerHTML = '<p>Cargando datos...</p>';
    
    // Construir URL según los filtros
    let url = '/datos_tendencias_enfermedades/?';
    if (enfermedadId) {
        const enfermedadNombre = document.getElementById('selectEnfermedad').options[
            document.getElementById('selectEnfermedad').selectedIndex
        ].text.split(' (')[0];
        url += `enfermedad_id=${enfermedadId}&enfermedad_nombre=${encodeURIComponent(enfermedadNombre)}`;
    }
    
    if (pacienteUsername) {
        url += `&paciente_username=${encodeURIComponent(pacienteUsername)}`;
    }

    // Mostrar mensaje de carga en el gráfico
    chartInfoContent.innerHTML = '<p>Obteniendo datos del servidor...</p>';
    
    // Obtener datos del servidor con timeout
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 10000)
    );

    Promise.race([fetchPromise, timeoutPromise])
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                chartData = data;
                renderChart(data, currentChartType);
                updateChartInfo(data);
            } else {
                chartInfoContent.innerHTML = `
                    <p class="text-danger">
                        ${data.message || 'Error al obtener datos del servidor'}
                    </p>
                    <p>URL: ${url}</p>
                `;
                console.error('Error del servidor:', data);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            chartInfoContent.innerHTML = `
                <p class="text-danger">
                    Error al conectar con el servidor: ${error.message}
                </p>
                <p>URL intentada: ${url}</p>
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
                    label: 'Tendencia',
                    data: data.values,
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    borderWidth: 2
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

    // Actualizar información del gráfico
    function updateChartInfo(data) {
        let infoHTML = `<h4>${data.title}</h4>`;
        
        if (data.enfermedad_info) {
            infoHTML += `<p><strong>Enfermedad:</strong> ${data.enfermedad_info.nombre}</p>`;
            infoHTML += `<p><strong>Total pacientes:</strong> ${data.enfermedad_info.total_pacientes}</p>`;
        }
        
        if (data.paciente_info) {
            infoHTML += `<p><strong>Paciente:</strong> ${data.paciente_info.nombre}</p>`;
            infoHTML += `<p><strong>Registros:</strong> ${data.paciente_info.total_registros}</p>`;
        }
        
        infoHTML += `<p><strong>Periodo analizado:</strong> ${data.periodo}</p>`;
        
        chartInfoContent.innerHTML = infoHTML;
    }
});