 document.addEventListener('DOMContentLoaded', function () {
    const idMedicoInput = document.getElementById("id_medico");
    const fechaInput = document.getElementById("fechaCita");
    const horaInput = document.getElementById("horaInicioCita");
    const form = document.querySelector('#crearCitaModal form');
    const errorDisponibilidad = document.getElementById("error-disponibilidad");
    const errorFecha = document.getElementById("error-fecha");
    const submitBtn = document.getElementById("btn-guardar-cita");

    async function validarDisponibilidad() {
      const id_medico = idMedicoInput.value;
      const fecha = fechaInput.value;
      const hora = horaInput.value;

      if (!id_medico || !fecha || !hora) {
        errorDisponibilidad.textContent = "";
        submitBtn.disabled = true;
        return false;
      }

      const now = new Date();
      now.setSeconds(0);
      now.setMilliseconds(0);
      const selectedDateTime = new Date(`${fecha}T${hora}`);
      if (selectedDateTime < now) {
        errorFecha.textContent = "No puedes agendar citas en el pasado.";
        submitBtn.disabled = true;
        return false;
      } else {
        errorFecha.textContent = "";
      }

      try {
        const response = await fetch(`/validar-disponibilidad/?id_medico=${id_medico}&fecha=${fecha}&hora=${hora}`);
        const data = await response.json();

        if (!data.disponible) {
          errorDisponibilidad.textContent = data.mensaje;
          submitBtn.disabled = true;
          return false;
        } else {
          errorDisponibilidad.textContent = "";
          submitBtn.disabled = false;
          return true;
        }
      } catch (error) {
        console.error("Error en la validación de disponibilidad:", error);
        errorDisponibilidad.textContent = "Error al validar la disponibilidad.";
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