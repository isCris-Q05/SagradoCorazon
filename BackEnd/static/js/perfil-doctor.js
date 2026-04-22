
    document.addEventListener('DOMContentLoaded', () => {
        const perfilDoctorModal = document.getElementById('perfilDoctorModal');

        perfilDoctorModal.addEventListener('show.bs.modal', (event) => {
            // Botón que activó el modal
            const button = event.relatedTarget;

            // Extraer los datos del atributo data-*
            const name = button.getAttribute('data-name');
            const genero = button.getAttribute('data-genero');
            const especialidad = button.getAttribute('data-especialidad');
            const foto = button.getAttribute('data-foto');

            // Actualizar el contenido del modal
            document.getElementById('fotoDoctor').src = foto;
            document.getElementById('nombreDoctor').textContent = name;
            document.getElementById('generoDoctor').textContent = `Género: ${genero}`;
            document.getElementById('especialidadDoctor').textContent = `Especialidad: ${especialidad}`;
        });
    });

