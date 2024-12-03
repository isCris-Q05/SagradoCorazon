document.addEventListener("DOMContentLoaded", () => {
  // Buscar pacientes
  const searchPacienteInput = document.getElementById("search-paciente");
  const resultsPaciente = document.getElementById("results-paciente");
  const idPacienteInput = document.getElementById("id_paciente");

  searchPacienteInput.addEventListener("input", async (event) => {
    const query = event.target.value;

    if (query.length > 2) {
      const response = await fetch(`/buscar_pacientes/?q=${query}`);
      const data = await response.json();

      resultsPaciente.innerHTML = "";
      data.forEach((paciente) => {
        const li = document.createElement("li");
        li.textContent = `${paciente.nombre} ${paciente.apellido}`;
        li.className = "list-group-item";
        li.addEventListener("click", () => {
          searchPacienteInput.value = `${paciente.nombre} ${paciente.apellido}`;
          idPacienteInput.value = paciente.id; // Llenar el input oculto
          resultsPaciente.innerHTML = "";
        });
        resultsPaciente.appendChild(li);
      });
    } else {
      resultsPaciente.innerHTML = "";
    }
  });

  // Buscar médicos
  const searchMedicoInput = document.getElementById("search-medico");
  const resultsMedico = document.getElementById("results-medico");
  const idMedicoInput = document.getElementById("id_medico");
  const especialidadesSelect = document.getElementById("especialidades");

  searchMedicoInput.addEventListener("input", async (event) => {
    const query = event.target.value;

    if (query.length > 2) {
      const response = await fetch(`/buscar_medicos/?q=${query}`);
      const data = await response.json();

      resultsMedico.innerHTML = "";
      if (data.length > 0) {
        data.forEach((medico) => {
          const li = document.createElement("li");
          li.textContent = `${medico.nombre} ${medico.apellido}`;
          li.className = "list-group-item";
          li.addEventListener("click", async () => {
            searchMedicoInput.value = `${medico.nombre} ${medico.apellido}`;
            idMedicoInput.value = medico.id; // Llenar el input oculto
            resultsMedico.innerHTML = "";

            // Vaciar el select de especialidades antes de llenar con nuevas opciones
            especialidadesSelect.innerHTML = '<option value="">Seleccione una especialidad</option>';

            // Obtener especialidades del médico seleccionado
            const especialidadesResponse = await fetch(
              `/obtener_especialidades/?id_medico=${medico.id}`
            );
            const especialidadesData = await especialidadesResponse.json();

            // Verificar si hay especialidades para el médico
            if (especialidadesData.length > 0) {
              especialidadesData.forEach((especialidad) => {
                const option = document.createElement("option");
                option.value = especialidad.id;
                option.textContent = especialidad.nombre;
                especialidadesSelect.appendChild(option);
              });
            } else {
              // Si no hay especialidades, poner una opción indicando que no se encontraron
              const option = document.createElement("option");
              option.value = "";
              option.textContent = "No se encontraron especialidades";
              especialidadesSelect.appendChild(option);
            }
          });
          resultsMedico.appendChild(li);
        });
      } else {
        // Si no se encuentran médicos, vaciar el select de especialidades
        especialidadesSelect.innerHTML = '<option value="">No se encontraron médicos</option>';
      }
    } else {
      resultsMedico.innerHTML = "";
      // Vaciar el select de especialidades cuando no hay texto en la búsqueda
      especialidadesSelect.innerHTML = '<option value="">Seleccione un médico</option>';
    }
  });
});
