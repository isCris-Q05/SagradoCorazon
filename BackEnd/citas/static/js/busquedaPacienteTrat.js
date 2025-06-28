document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("buscarPaciente2");
    const sugerenciasDiv = document.getElementById("sugerenciasPaciente2");
    // Variable para almacenar el username del paciente seleccionado
    let pacienteSeleccionado = null;

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        sugerenciasDiv.innerHTML = '';
        pacienteSeleccionado = null; // Resetear al cambiar la búsqueda

        if (query.length < 2) return;

        try {
            const response = await fetch(`/buscar-pacientes2/?q=${encodeURIComponent(query)}`);
            const pacientes = await response.json();

            pacientes.forEach(paciente => {
                const item = document.createElement("div");
                item.className = "list-group-item list-group-item-action";
                item.textContent = paciente.nombre;
                item.addEventListener("click", () => {
                    input.value = paciente.nombre;
                    pacienteSeleccionado = paciente; // Guardar todo el objeto paciente
                    sugerenciasDiv.innerHTML = '';
                });
                sugerenciasDiv.appendChild(item);
            });
        } catch (error) {
            console.error("Error al buscar pacientes:", error);
        }
    });

    // Cierra las sugerencias si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (!sugerenciasDiv.contains(e.target) && e.target !== input) {
            sugerenciasDiv.innerHTML = '';
        }
    });

    // Función para obtener el username del paciente seleccionado
    window.obtenerPacienteUsername = function() {
        return pacienteSeleccionado ? pacienteSeleccionado.username : null;
    };
});