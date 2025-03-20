// static/js/modal.js

// Script para pasar los datos al modal
var detalleModal = document.getElementById('detalleModal');
if (detalleModal) {
    detalleModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget; // Botón que abrió el modal
        var nombre = button.getAttribute('data-nombre');
        var descripcion = button.getAttribute('data-descripcion');
        var tratamientos = button.getAttribute('data-tratamientos');

        // Actualizar los campos del modal
        var modalNombre = detalleModal.querySelector('#modalEnfermedadNombre');
        var modalDescripcion = detalleModal.querySelector('#modalEnfermedadDescripcion');
        var modalTratamientos = detalleModal.querySelector('#modalEnfermedadTratamientos');

        modalNombre.textContent = nombre;
        modalDescripcion.textContent = descripcion;
        modalTratamientos.textContent = tratamientos;
    });
}
