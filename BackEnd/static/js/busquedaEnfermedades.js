document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("buscarPaciente");
    const sugerenciasDiv = document.getElementById("sugerenciasPaciente");
    
    // Almacenamos el paciente seleccionado en el objeto window
    window.pacienteSeleccionado = null;

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        sugerenciasDiv.innerHTML = '';
        window.pacienteSeleccionado = null;

        if (query.length < 2) return;

        try {
            const response = await fetch(`/buscar-pacientes2/?q=${encodeURIComponent(query)}`);
            const pacientes = await response.json();

            pacientes.forEach(paciente => {
                const item = document.createElement("div");
                item.className = "list-group-item list-group-item-action";
                item.textContent = `${paciente.nombre} (${paciente.username})`;
                item.addEventListener("click", () => {
                    input.value = paciente.nombre;
                    window.pacienteSeleccionado = paciente; // Almacenamos el objeto completo
                    sugerenciasDiv.innerHTML = '';
                });
                sugerenciasDiv.appendChild(item);
            });
        } catch (error) {
            console.error("Error al buscar pacientes:", error);
        }
    });

    document.addEventListener("click", (e) => {
        if (!sugerenciasDiv.contains(e.target) && e.target !== input) {
            sugerenciasDiv.innerHTML = '';
        }
    });
});