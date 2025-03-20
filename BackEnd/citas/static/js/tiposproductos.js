const tiposProductos = [
    "Limpieza de la Piel",
    "Hidratantes",
    "Protectores Solares",
    "Tratamiento para el Acne",
    "Antienvejecimiento",
    "Productos para Piel Sensible",
    "Exfoliantes",
    "Tratamientos Especiales",
    "Cosmeticos Dermatologicos",
    "Cuidado del Cuero Cabelludo",
    "Proteccion y Reparacion",
    "Productos Naturales u Organicos",
];

const input = document.querySelector("#tipoProducto");
const suggestions = document.querySelector("#suggestions");

// Función para eliminar acentos
const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Escuchar eventos de entrada
input.addEventListener("input", () => {
    const query = removeAccents(input.value.toLowerCase());
    suggestions.innerHTML = ""; // Limpiar sugerencias anteriores

    if (query) {
        const matches = tiposProductos.filter((tipo) =>
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
