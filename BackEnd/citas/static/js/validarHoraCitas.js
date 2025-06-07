 document.addEventListener('DOMContentLoaded', function () {
    const idMedicoInput = document.getElementById("id_medico");
    const fechaInput = document.getElementById("fechaCita");
    const horaInput = document.getElementById("horaInicioCita");
    const form = document.querySelector('#crearCitaModal form');
    const errorSpan = document.getElementById("error-disponibilidad");
    const submitBtn = document.getElementById("btn-guardar-cita");

    async function validarDisponibilidad() {
      const id_medico = idMedicoInput.value;
      const fecha = fechaInput.value;
      const hora = horaInput.value;

      if (!id_medico || !fecha || !hora) {
        errorSpan.textContent = "";
        submitBtn.disabled = true;
        return false;
      }

      try {
        const response = await fetch(`/validar-disponibilidad/?id_medico=${id_medico}&fecha=${fecha}&hora=${hora}`);
        const data = await response.json();

        if (!data.disponible) {
          errorSpan.textContent = data.mensaje;
          submitBtn.disabled = true;
          return false;
        } else {
          errorSpan.textContent = "";
          submitBtn.disabled = false;
          return true;
        }
      } catch (error) {
        console.error("Error en la validación de disponibilidad:", error);
        errorSpan.textContent = "Error al validar la disponibilidad.";
        submitBtn.disabled = true;
        return false;
      }
    }

    // Validar cada vez que cambien los campos
    idMedicoInput.addEventListener("change", validarDisponibilidad);
    fechaInput.addEventListener("change", validarDisponibilidad);
    horaInput.addEventListener("change", validarDisponibilidad);

    // Evita enviar el formulario si hay conflicto
    form.addEventListener("submit", async function (e) {
      const disponible = await validarDisponibilidad();
      if (!disponible) {
        e.preventDefault();
      }
    });
  });