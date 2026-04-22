document.addEventListener('DOMContentLoaded', function() {
    $('#detailsModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var nombre = button.data('nombre');
        var descripcion = button.data('descripcion');
        var enfermedades = button.data('enfermedades');
        
        var modal = $(this);
        modal.find('#modalTreatmentName').text(nombre);
        modal.find('#modalTreatmentDescription').text(descripcion);
        modal.find('#modalTreatmentDiseases').text(enfermedades);
    });
});