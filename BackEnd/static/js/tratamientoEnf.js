document.addEventListener("DOMContentLoaded", () => {
    const enfermedadesSelect = document.getElementById("enfermedades");
    const tratamientosContainer = document.getElementById("tratamientosContainer");
    const tratamientosChecklist = document.getElementById("tratamientosChecklist");

    enfermedadesSelect.addEventListener("change", async () => {
        const enfermedadId = enfermedadesSelect.value;

        if (!enfermedadId) {
            tratamientosContainer.style.display = "none";
            tratamientosChecklist.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`tratamientos-por-enfermedad/?id_enfermedad=${enfermedadId}`);
            const data = await response.json();

            if (data.tratamientos) {
                tratamientosChecklist.innerHTML = "";

                data.tratamientos.forEach((tratamiento) => {
                    const col = document.createElement("div");
                    col.className = "col-md-4 mb-3"; // Tres columnas por fila
                    col.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="tratamientos" value="${tratamiento.id_tratamiento}" id="tratamiento-${tratamiento.id_tratamiento}">
                            <label class="form-check-label" for="tratamiento-${tratamiento.id_tratamiento}">
                                ${tratamiento.nombre}
                            </label>
                        </div>
                    `;

                    tratamientosChecklist.appendChild(col);
                });

                tratamientosContainer.style.display = "block";
            } else {
                tratamientosContainer.style.display = "none";
                tratamientosChecklist.innerHTML = "";
            }
        } catch (error) {
            console.error("Error al obtener los tratamientos:", error);
            tratamientosContainer.style.display = "none";
        }
    });
});
