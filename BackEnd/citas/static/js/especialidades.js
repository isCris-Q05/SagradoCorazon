const especialidades = [
    "Dermatología Clínica",
    "Dermatología Estética",
    "Dermatología Pediátrica",
    "Dermatología Oncológica",
    "Dermatología Quirúrgica",
    "Tratamiento de Psoriasis",
    "Tratamiento de Acné",
    "Tratamiento de Eczemas y Dermatitis",
    "Cirugía Dermatológica",
    "Dermatopatología",
    "Tratamiento de Alopecia",
    "Terapias con Láser Dermatológico",
];

const input = document.querySelector("#especialidad");
const suggestions = document.querySelector("#suggestions");

// Función para eliminar acentos
const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Escuchar eventos de entrada
input.addEventListener("input", () => {
    const query = removeAccents(input.value.toLowerCase());
    suggestions.innerHTML = ""; // Limpiar sugerencias anteriores

    if (query) {
        const matches = especialidades.filter((tipo) =>
            removeAccents(tipo.toLowerCase()).includes(query)
        );

        matches.forEach((match) => {
            const item = document.createElement("div");
            item.classList.add("list-group-item", "list-group-item-action");
            item.textContent = match;

            // Evento para seleccionar la sugerencia
            item.addEventListener("click", () => {
                input.value = match;
                suggestions.innerHTML = ""; // Limpiar sugerencias
            });

            suggestions.appendChild(item);
        });
    }
});
