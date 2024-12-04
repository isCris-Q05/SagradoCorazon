document.addEventListener('DOMContentLoaded', () => {
    const detailsModal = document.getElementById('detailsModal');
    detailsModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget; // Botón que disparó el modal
        const treatmentName = button.getAttribute('data-name');
        const diseases = button.getAttribute('data-enfermedades');
        const description = button.getAttribute('data-descripcion');

        // Asignar valores al modal
        document.getElementById('modalTreatmentName').textContent = treatmentName;
        document.getElementById('modalDiseases').textContent = diseases || 'Sin información';
        document.getElementById('modalTreatmentDescription').textContent = description || 'Sin descripción';
    });
});
