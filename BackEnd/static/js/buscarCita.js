document.addEventListener("DOMContentLoaded", () => {
  // Obtener referencia a los elementos del DOM
  const inputCodigoCita = document.getElementById("codigoCita");
  const resultadosCita = document.getElementById("resultadosCita");
  const nombrePaciente = document.getElementById("nombrePaciente");
  const nombreMedico = document.getElementById("nombreMedico");

  // Crear un elemento separado para el mensaje de error
  const mensajeError = document.createElement("p");
  mensajeError.id = "mensajeError";
  mensajeError.style.color = "red";
  mensajeError.style.marginTop = "10px";
  mensajeError.style.display = "none";
  inputCodigoCita.parentNode.appendChild(mensajeError); // Insertar después del campo de entrada

  // Evento para detectar cambios en el campo del código de cita
  inputCodigoCita.addEventListener("input", async () => {
    const codigoCita = inputCodigoCita.value.trim(); // Eliminar espacios en blanco

    // Si no hay código ingresado, ocultar resultados y mensaje de error
    if (!codigoCita) {
      resultadosCita.style.display = "none";
      mensajeError.style.display = "none";
      nombrePaciente.textContent = "";
      nombreMedico.textContent = "";
      return;
    }

    try {
      // Realizar la petición al endpoint para buscar la cita
      const response = await fetch(`/buscar_cita/?codigo_cita=${codigoCita}`);

      if (!response.ok) {
        throw new Error("Cita no encontrada");
      }

      const result = await response.json();

      if (result.success) {
        // Si se encuentra la cita, mostrar los datos
        nombrePaciente.textContent = result.data.paciente;
        nombreMedico.textContent = result.data.medico;
        mensajeError.style.display = "none"; // Ocultar mensaje de error
        resultadosCita.style.display = "block"; // Mostrar resultados
      } else {
        // Si la cita no es encontrada, mostrar solo el mensaje de error
        mensajeError.textContent = "Cita no encontrada.";
        mensajeError.style.display = "block";
        resultadosCita.style.display = "none"; // Ocultar resultados
        nombrePaciente.textContent = "";
        nombreMedico.textContent = "";
      }
    } catch (error) {
      // Manejar errores en la comunicación con el backend
      console.error("Error al buscar la cita:", error.message);
      mensajeError.textContent = "Error al buscar la cita.";
      mensajeError.style.display = "block";
      resultadosCita.style.display = "none"; // Ocultar resultados
      nombrePaciente.textContent = "";
      nombreMedico.textContent = "";
    }
  });
});
