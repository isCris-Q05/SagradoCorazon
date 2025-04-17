document.addEventListener('DOMContentLoaded', () => {
    
    const perfilPacienteModal = document.getElementById('perfilPacienteModal');

    perfilPacienteModal.addEventListener('show.bs.modal', (event) => {
        // Botón que activó el modal
        const button = event.relatedTarget;

        // Extraer los datos del atributo data-*
        const fechaNac = button.getAttribute('data-fechaNac') || 'N/A';
        const nombre = button.getAttribute('data-name') || 'N/A';
        const apellido = button.getAttribute('data-apellido') || 'N/A';
        const generoPaciente = button.getAttribute('data-genero') || 'N/A';
        const alergiasPaciente = button.getAttribute('data-alergias') || 'N/A';
        const foto = button.getAttribute('data-foto') || '';
        const enfermedadesPaciente = button.getAttribute('data-enfermedades') || 'N/A';
        const telefonoPaciente = button.getAttribute('data-telefono') || 'N/A';        

        const edad = calcularEdad(fechaNac);
        let alergias = alergiasPaciente.replace(/[\[\]']/g, "");
        let enfermedades = enfermedadesPaciente.replace(/[\[\]']/g, "");

        if (alergias === "") {
            alergias = "N/A"
        }
        
        if (enfermedades === ""){
            enfermedades = "N/A";
        }

        // Actualizar el contenido del modal
        document.getElementById('perfilFoto').src = foto;
        document.getElementById('perfilNombre').textContent = `${nombre} ${apellido}`;
        document.getElementById('perfilEdad').textContent = edad;
        document.getElementById('perfilGenero').textContent = generoPaciente;
        document.getElementById('perfilAlergias').textContent = alergias;
        document.getElementById('perfilEnfermedades').textContent = enfermedades;
        document.getElementById('perfilTelefono').textContent = telefonoPaciente;
    });
});

const calcularEdad = (fechaNac) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}
