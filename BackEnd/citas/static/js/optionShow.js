document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos
  const mostrarCitasBtn = document.getElementById("mostrarCitasBtn");
  const mostrarRegistrosBtn = document.getElementById("mostrarRegistrosBtn");
  const tablaCitas = document.getElementById("tablaCitas");
  const tablaRegistros = document.getElementById("tablaRegistros");
  const calendarioCitas = document.getElementById("calendarioCitas");
  const vistaToggleContainer = document.getElementById("vistaToggleContainer");
  const vistaTablaBtn = document.getElementById("vistaTablaBtn");
  const vistaCalendarioBtn = document.getElementById("vistaCalendarioBtn");
  const calendarEl = document.getElementById("calendar");

  // Inicializar el calendario
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    firstDay: 1, // Lunes como primer día de la semana
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
    },
    height: "auto",
    contentHeight: "auto",
    events: function (fetchInfo, successCallback, failureCallback) {
      // Convertir las citas de la tabla a eventos del calendario
      const events = Array.from(
        document.querySelectorAll("#tablaCitas tbody tr")
      ).map((row) => {
        const cells = row.cells;
        const fecha = cells[3].textContent.trim();
        const hora = cells[4].textContent.trim();
        const estado = cells[2].querySelector(".badge").textContent.trim();

        // Crear objeto de fecha (ajusta según tu formato)
        const startDateTime = new Date(`${fecha}T${hora}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hora

        return {
          title: `${cells[1].textContent.trim()} - ${cells[5].textContent.trim()}`,
          start: startDateTime,
          end: endDateTime,
          color: getEventColor(estado),
          extendedProps: {
            id: cells[0].textContent.trim(),
            estado: estado,
          },
        };
      });

      successCallback(events);
    },
    eventClick: function (info) {
      // Mostrar detalles de la cita
      const startStr = info.event.start.toLocaleString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      alert(`Detalles de la cita:
ID: ${info.event.extendedProps.id}
Paciente: ${info.event.title.split(" - ")[0]}
Médico: ${info.event.title.split(" - ")[1]}
Fecha: ${startStr}
Estado: ${info.event.extendedProps.estado}`);
    },
  });

  calendar.render();

  function getEventColor(estado) {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "#ffc107"; // Amarillo
      case "finalizada":
        return "#28a745"; // Verde
      case "no asistió":
        return "#dc3545"; // Rojo
      default:
        return "#0d6efd"; // Azul
    }
  }

  // Función para ocultar todas las vistas
  function ocultarTodasLasVistas() {
    tablaCitas.classList.add("hidden");
    calendarioCitas.classList.add("hidden");
    tablaRegistros.classList.add("hidden");
  }

  // Función para mostrar citas (tabla o calendario)
  function mostrarCitas(vistaCalendario = false) {
    ocultarTodasLasVistas();

    if (vistaCalendario) {
      calendarioCitas.classList.remove("hidden");
      contenedorPrincipal.classList.add('calendar-view'); // Añade clase para calendario
    } else {
      tablaCitas.classList.remove("hidden");
      contenedorPrincipal.classList.remove('calendar-view'); // Elimina clase para calendario
    }

    vistaToggleContainer.style.display = "inline-block";

    // Actualizar estado de los botones
    vistaTablaBtn.classList.toggle("active", !vistaCalendario);
    vistaTablaBtn.classList.toggle("btn-success", !vistaCalendario);
    vistaTablaBtn.classList.toggle("btn-outline-success", vistaCalendario);

    vistaCalendarioBtn.classList.toggle("active", vistaCalendario);
    vistaCalendarioBtn.classList.toggle("btn-success", vistaCalendario);
    vistaCalendarioBtn.classList.toggle(
      "btn-outline-success",
      !vistaCalendario
    );

    // Actualizar calendario si es necesario
    if (vistaCalendario) {
      calendar.refetchEvents();
      calendar.updateSize();
    }
  }

  // Función para mostrar registros
  function mostrarRegistros() {
    ocultarTodasLasVistas();
    tablaRegistros.classList.remove("hidden");
    contenedorPrincipal.classList.remove('calendar-view'); // Asegura que no tenga estilo de calendario
    vistaToggleContainer.style.display = "none";
  }

  // Función para actualizar estado de botones principales
  function actualizarBotonesPrincipales(mostrarCitas) {
    if (mostrarCitas) {
      mostrarCitasBtn.classList.add("active");
      mostrarRegistrosBtn.classList.remove("active");
    } else {
      mostrarRegistrosBtn.classList.add("active");
      mostrarCitasBtn.classList.remove("active");
    }
  }

  // Event listeners
  mostrarCitasBtn.addEventListener("click", function () {
    const vistaCalendarioActiva =
      vistaCalendarioBtn.classList.contains("active");
    mostrarCitas(vistaCalendarioActiva);
    actualizarBotonesPrincipales(true);
  });

  mostrarRegistrosBtn.addEventListener("click", function () {
    mostrarRegistros();
    actualizarBotonesPrincipales(false);
  });

  vistaTablaBtn.addEventListener("click", function () {
    mostrarCitas(false);
    actualizarBotonesPrincipales(true);
  });

  vistaCalendarioBtn.addEventListener("click", function () {
    mostrarCitas(true);
    actualizarBotonesPrincipales(true);
  });

  // Inicialización: mostrar citas en vista de tabla por defecto
  mostrarCitas(false);
  actualizarBotonesPrincipales(true);

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
      const fechaInput = document.getElementById("editFecha").value;
      const hora = document.getElementById("editHora").value;
      const telefono = document.getElementById("editTelefono").value; // Obtener el teléfono

      const fecha = new Date(fechaInput + "T00:00:00Z");
      const opciones = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      };
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
