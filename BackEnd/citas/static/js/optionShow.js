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
    const telefono = button.getAttribute("data-telefono");

    // Actualizar los campos del formulario
    document.getElementById("editIdCita").value = id;
    document.getElementById("editPaciente").value = paciente;
    document.getElementById("editEstado").value = estado;
    document.getElementById("editFecha").value = fecha;
    document.getElementById("editHora").value = hora;
    document.getElementById("editMedico").value = medico;

    document.getElementById("editTelefono").value = telefono;
  });

  // Envio del recordatorio
  // Manejar el envío del recordatorio
  document
    .getElementById("sendNotification")
    .addEventListener("click", function () {
      // obteniendo datos de la cita
      const doctor = document.getElementById("editMedico").value;
      const fechaInput  = document.getElementById("editFecha").value;
      const hora = document.getElementById("editHora").value;
      const telefono = document.getElementById("editTelefono").value; // Obtener el teléfono

      const fecha = new Date(fechaInput + "T00:00:00Z");
      const opciones = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
      const fechaFormateada = fecha.toLocaleDateString("es-NI", opciones);

      const message = `Hola, este es un recordatorio de su cita en la clínica dermatológica. Fecha: ${fechaFormateada}, Hora: ${hora}. 
      en la clinica dermatologica de Matagalpa con el doctor ${doctor}`; // Mensaje de recordatorio
      // Datos a enviar en la solicitud POST
      const formData = new FormData();
      formData.append("phone_number", telefono);
      formData.append("message", message);

      // Enviar la solicitud POST
      fetch("/send-reminder/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"), // Obtener el token CSRF
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Recordatorio enviado correctamente.");
          } else {
            alert("Error al enviar el recordatorio: " + data.message);
          }
        })
        .catch((error) => {
          alert("Error en la solicitud: " + error.message);
        });
    });

  // Función para obtener el token CSRF desde las cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
