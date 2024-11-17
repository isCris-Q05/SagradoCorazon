document.addEventListener('DOMContentLoaded', function() {
    const detailsModal = document.getElementById('detailsModal');
    detailsModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget; // El botón que abrió el modal
        const name = button.getAttribute('data-name');
        const enfermedad = button.getAttribute('data-enfermedad');
        const descripcionEnfermedad = button.getAttribute('data-descripcion');

        // Llenar los campos del modal con los datos del botón
        document.getElementById('modalTreatmentName').textContent = name;
        document.getElementById('modalDiseaseName').textContent = enfermedad;
        document.getElementById('modalDiseaseDescription').textContent = descripcionEnfermedad;
    });
});
