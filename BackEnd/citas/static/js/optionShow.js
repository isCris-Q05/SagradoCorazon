document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("mostrarCitasBtn")
    .addEventListener("click", function () {
      document.getElementById("tablaCitas").style.display = "block";
      document.getElementById("tablaRegistros").style.display = "none";
    });

  document
    .getElementById("mostrarRegistrosBtn")
    .addEventListener("click", function () {
      document.getElementById("tablaCitas").style.display = "none";
      document.getElementById("tablaRegistros").style.display = "block";
    });

  // editar citas
  const editCitaModal = document.getElementById("editCitaModal");
  editCitaModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget; // Botón que activó el modal
    const id = button.getAttribute("data-id");
    const paciente = button.getAttribute("data-paciente");
    const estado = button.getAttribute("data-estado");
    const fecha = button.getAttribute("data-fecha");
    const hora = button.getAttribute("data-hora");
    const medico = button.getAttribute("data-medico");

    // Actualizar los campos del formulario
    document.getElementById("editIdCita").value = id;
    document.getElementById("editPaciente").value = paciente;
    document.getElementById("editEstado").value = estado;
    document.getElementById("editFecha").value = fecha;
    document.getElementById("editHora").value = hora;
    document.getElementById("editMedico").value = medico;
  });

  
});
