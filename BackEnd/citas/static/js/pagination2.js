$(document).ready(function () {
    const itemsPerPage = 9; // Número de elementos por página
    const $items = $("#items2 .col"); // Seleccionamos todos los elementos
    const $paginationControls = $("#paginationControls2");

    let currentPage = 1;

    // Función para renderizar los elementos de la página actual
    function renderPage(page) {
        const totalItems = $items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        $items.hide().slice(start, end).show();
        updatePagination(totalPages);
    }

    // Función para actualizar los controles de paginación
    function updatePagination(totalPages) {
        $paginationControls.empty();
        for (let i = 1; i <= totalPages; i++) {
            const $button = $("<button>")
                .text(i)
                .addClass("btn btn-outline-primary mx-1")
                .toggleClass("active", i === currentPage)
                .click(() => {
                    currentPage = i;
                    renderPage(currentPage);
                });
            $paginationControls.append($button);
        }
    }

    // Cargar la primera página al iniciar
    renderPage(currentPage);
});
