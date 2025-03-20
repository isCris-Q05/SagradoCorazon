// productos.js

var detailsModal = document.getElementById('detailsModal');
if (detailsModal) {
    detailsModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var nombre = button.getAttribute('data-nombre');
        var descripcion = button.getAttribute('data-descripcion');
        var precio = button.getAttribute('data-precio');
        var marca = button.getAttribute('data-marca');
        var tipo = button.getAttribute('data-tipo');

        document.getElementById('modalProductName').textContent = nombre;
        document.getElementById('modalProductDescription').textContent = descripcion;
        document.getElementById('modalProductPrice').textContent = 'C$' + precio;
        document.getElementById('modalProductBrand').textContent = marca;
        document.getElementById('modalProductType').textContent = tipo;
    });
}
