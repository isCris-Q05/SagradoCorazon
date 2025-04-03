// Mostrar alerta al hacer clic en "Subir Reporte"
document.getElementById('subirReporteBtn').addEventListener('click', function() {
    const alert = document.getElementById('customAlert');
    alert.classList.add('show');
    
    // Cerrar alerta después de 3 segundos (opcional)
    setTimeout(() => {
      alert.classList.remove('show');
    }, 3000);
  });
  
  // Cerrar alerta al hacer clic en el botón
  document.getElementById('closeAlert').addEventListener('click', function() {
    document.getElementById('customAlert').classList.remove('show');
  });