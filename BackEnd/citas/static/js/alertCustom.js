document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('excelUploadForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const subirBtn = document.getElementById('subirReporteBtn');
      if (!subirBtn) {
          console.error('Botón no encontrado');
          return;
      }

      const originalBtnText = subirBtn.innerHTML;
      const formData = new FormData(this);
      
      // Mostrar estado de carga
      subirBtn.disabled = true;
      subirBtn.innerHTML = `
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Procesando...
      `;

      try {
          const response = await fetch('', {
              method: 'POST',
              body: formData,
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              }
          });

          if (!response.ok) throw new Error('Error en la respuesta del servidor');
          
          const data = await response.json();
          
          // Restaurar botón
          subirBtn.disabled = false;
          subirBtn.innerHTML = originalBtnText;
          
          // Mostrar alerta dinámica
          showDynamicAlert(
              data.status === 'success', 
              data.status === 'success' ? '¡Éxito!' : '¡Error!',
              data.message
          );
          
      } catch (error) {
          // Restaurar botón
          if (subirBtn) {
              subirBtn.disabled = false;
              subirBtn.innerHTML = originalBtnText;
          }
          
          console.error('Error:', error);
          showDynamicAlert(
              false,
              '¡Error!',
              'Error en la comunicación con el servidor'
          );
      }
  });

  // Función para mostrar alertas dinámicas
  function showDynamicAlert(isSuccess, title, message) {
      const alert = document.getElementById('customAlert');
      if (!alert) {
          console.error('Elemento de alerta no encontrado');
          return;
      }

      // Configurar contenido dinámico
      const iconPath = isSuccess ? 
          "M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M10,17l-5-5l1.41-1.41L10,14.17l7.59-7.59L19,8l-9,9z" :
          "M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z";

      alert.innerHTML = `
          <div class="alert-content ${isSuccess ? 'success' : 'error'}">
              <div class="alert-icon">
                  <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="${iconPath}"/>
                  </svg>
              </div>
              <h3>${title}</h3>
              <p>${message}</p>
              <button id="closeAlert" class="alert-btn">Aceptar</button>
          </div>
      `;

      // Mostrar alerta
      alert.classList.add('show');

      // Configurar evento de cierre
      const closeBtn = document.getElementById('closeAlert');
      if (closeBtn) {
          closeBtn.addEventListener('click', function() {
              alert.classList.remove('show');
          });
      }

      // Ocultar después de 5 segundos
      setTimeout(() => {
          alert.classList.remove('show');
      }, 5000);
  }
});