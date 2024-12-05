document.getElementById('formCrearCita').addEventListener('submit', function(event) {
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFinal = document.getElementById('horaFinal').value;

    if (horaInicio && horaFinal && horaFinal <= horaInicio) {
        alert('La hora de finalización debe ser posterior a la hora de inicio.');
        event.preventDefault(); // Evita el envío del formulario
    }
});


document.getElementById("forms").addEventListener("submit", function(event) {
    const cedulaInput = document.getElementById("cedulaPaciente").value.trim();
    const cedulaPattern = /^[0-9]{3}[0-9]{6}[0-9]{4}[A-Z]$/;

    if (!cedulaPattern.test(cedulaInput)) {
        alert("La cédula debe tener 16 caracteres numéricos seguidos de una letra final. Ejemplo: 4412511041002N");
        event.preventDefault(); // Evita el envío si la validación falla
    }
});