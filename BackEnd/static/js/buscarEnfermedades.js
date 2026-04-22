document.addEventListener("DOMContentLoaded", function () {
    const buscarEnfermedad = document.getElementById("buscarEnfermedad");
    const resultadosEnfermedad = document.getElementById("resultadosEnfermedad");
    const idEnfermedadSeleccionada = document.getElementById("idEnfermedadSeleccionada");

    buscarEnfermedad.addEventListener("input", async function () {
        const query = buscarEnfermedad.value.trim();

        if (query.length > 0) {
            try {
                const response = await fetch(`/buscar-enfermedades/?q=${query}`);
                const data = await response.json();

                // Limpiar los resultados anteriores
                resultadosEnfermedad.innerHTML = "";

                if (data.length > 0) {
                    resultadosEnfermedad.style.display = "block";
                    data.forEach(enfermedad => {
                        const li = document.createElement("li");
                        li.className = "list-group-item list-group-item-action";
                        li.textContent = enfermedad.nombre;
                        li.dataset.id = enfermedad.id_enfermedad;

                        li.addEventListener("click", function () {
                            buscarEnfermedad.value = enfermedad.nombre;
                            idEnfermedadSeleccionada.value = enfermedad.id_enfermedad; // Actualizar el campo oculto
                            resultadosEnfermedad.style.display = "none";
                        });

                        resultadosEnfermedad.appendChild(li);
                    });
                } else {
                    resultadosEnfermedad.style.display = "none";
                }
            } catch (error) {
                console.error("Error al buscar enfermedades:", error);
            }
        } else {
            resultadosEnfermedad.style.display = "none";
        }
    });

    // Cierra los resultados si el usuario hace clic fuera del input
    document.addEventListener("click", function (e) {
        if (!buscarEnfermedad.contains(e.target) && !resultadosEnfermedad.contains(e.target)) {
            resultadosEnfermedad.style.display = "none";
        }
    });
});
