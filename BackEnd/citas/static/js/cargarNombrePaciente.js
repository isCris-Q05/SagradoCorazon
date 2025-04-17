document.addEventListener("DOMContentLoaded", () => {
    const pacienteNombre = window.pacienteNombre;
    if (pacienteNombre === "None") {
      return;
    }

    document.getElementById("search-paciente").value = pacienteNombre;
      const modal = new bootstrap.Modal(document.getElementById("crearCitaModal"));
      modal.show();
  });