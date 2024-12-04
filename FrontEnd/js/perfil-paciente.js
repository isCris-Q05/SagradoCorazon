document.addEventListener('DOMContentLoaded', () => {
    const perfilPacienteModal = document.getElementById('perfilPacienteModal');

    perfilPacienteModal.addEventListener('show.bs.modal', (event) => {
        // Botón que activó el modal
        const button = event.relatedTarget;

        // Extraer los datos del atributo data-*
        const nombre = button.getAttribute('data-name') || 'N/A';
        const apellido = button.getAttribute('data-apellido') || 'N/A';
        const edad = button.getAttribute('data-edad') || 'N/A';
        const generoPaciente = button.getAttribute('data-genero') || 'N/A';
        const alergiasPaciente = button.getAttribute('data-alergias') || 'N/A';
        const foto = button.getAttribute('data-foto') || '';
        const enfermedadesPaciente = button.getAttribute('data-enfermedades') || 'N/A';
        const telefonoPaciente = button.getAttribute('data-telefono') || 'N/A';

        // Actualizar el contenido del modal
        document.getElementById('perfilFoto').src = foto;
        document.getElementById('perfilNombre').textContent = `${nombre} ${apellido}`;
        document.getElementById('perfilEdad').textContent = edad;
        document.getElementById('perfilGenero').textContent = generoPaciente;
        document.getElementById('perfilAlergias').textContent = alergiasPaciente;
        document.getElementById('perfilEnfermedades').textContent = enfermedadesPaciente;
        document.getElementById('perfilTelefono').textContent = telefonoPaciente;
    });
});