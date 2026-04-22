$(document).ready(function () {
    // Función para actualizar el campo oculto con la lista de elementos
    function actualizarCampoOculto(listaSelector, campoSelector) {
        const valores = [];
        $(listaSelector)
            .find("li")
            .each(function () {
                const texto = $(this).clone().children().remove().end().text().trim();
                valores.push(texto);
            });
        $(campoSelector).val(valores.join(","));
    }

    // Agregar especialidad a la lista
    $("#agregarEspecialidad").on("click", function () {
        const especialidad = $("#especialidad").val().trim();
        if (especialidad && !especialidadYaAgregada(especialidad)) {
            const elemento = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${especialidad}
                    <button type="button" class="btn btn-danger btn-sm eliminar-especialidad">Eliminar</button>
                </li>`;
            $("#listaEspecialidades").append(elemento);
            $("#especialidad").val(""); // Limpia el input
            actualizarCampoOculto("#listaEspecialidades", "#campoEspecialidades"); // Actualiza el campo oculto
        }
    });

    // Función para verificar si la especialidad ya está agregada
    function especialidadYaAgregada(especialidad) {
        return $("#listaEspecialidades li").toArray().some((li) => $(li).text().includes(especialidad));
    }

    // Eliminar especialidad
    $(document).on("click", ".eliminar-especialidad", function () {
        $(this).closest("li").remove(); // Elimina el elemento "li" que contiene el botón
        actualizarCampoOculto("#listaEspecialidades", "#campoEspecialidades"); // Actualiza el campo oculto
    });

    // Actualizar campos ocultos antes de enviar el formulario
    $("form").on("submit", function () {
        actualizarCampoOculto("#listaEspecialidades", "#campoEspecialidades");
    });
});
