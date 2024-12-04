
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

    // Agregar elemento a la lista de enfermedades
    $("#agregarEnfermedad").on("click", function () {
        const nuevaEnfermedad = $("#inputEnfermedad").val().trim();
        if (nuevaEnfermedad) {
            const elemento = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${nuevaEnfermedad}
                    <button type="button" class="btn btn-danger btn-sm eliminar-enfermedad">Eliminar</button>
                </li>`;
            $("#listaEnfermedades").append(elemento);
            $("#inputEnfermedad").val(""); // Limpia el input
            actualizarCampoOculto("#listaEnfermedades", "#campoEnfermedades"); // Actualiza el campo oculto
        }
    });

    // Agregar elemento a la lista de alergias
    $("#agregarAlergia").on("click", function () {
        const nuevaAlergia = $("#inputAlergia").val().trim();
        if (nuevaAlergia) {
            const elemento = `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${nuevaAlergia}
                    <button type="button" class="btn btn-danger btn-sm eliminar-alergia">Eliminar</button>
                </li>`;
            $("#listaAlergias").append(elemento);
            $("#inputAlergia").val(""); // Limpia el input
            actualizarCampoOculto("#listaAlergias", "#campoAlergias"); // Actualiza el campo oculto
        }
    });

    // Eliminar elemento de la lista de enfermedades
    $(document).on("click", ".eliminar-enfermedad", function () {
        $(this).closest("li").remove(); // Elimina el elemento "li" que contiene el botón
        actualizarCampoOculto("#listaEnfermedades", "#campoEnfermedades"); // Actualiza el campo oculto
    });

    // Eliminar elemento de la lista de alergias
    $(document).on("click", ".eliminar-alergia", function () {
        $(this).closest("li").remove(); // Elimina el elemento "li" que contiene el botón
        actualizarCampoOculto("#listaAlergias", "#campoAlergias"); // Actualiza el campo oculto
    });

    // Actualizar campos ocultos antes de enviar el formulario
    $("form").on("submit", function () {
        actualizarCampoOculto("#listaEnfermedades", "#campoEnfermedades");
        actualizarCampoOculto("#listaAlergias", "#campoAlergias");
    });
});
