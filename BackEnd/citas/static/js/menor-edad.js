document.addEventListener("DOMContentLoaded", () => {
    const fechaNacimientoInput = document.getElementById("fechaNacimientoPaciente");
    const tabContacto = document.getElementById("tab-contacto");
    const tabAdicional = document.getElementById("tab-adicional");
    const campoCedula = document.getElementById('campoCedula');
    const seccionBasica = document.getElementById("seccionBasica");
    const form = document.getElementById("forms");  // Asegúrate de que el ID del formulario sea el correcto

    const seccionTutorHTML = `
        <div id="seccionTutor" class="mt-3">
            <div class="mb-3">
                <label for="nombreTutor" class="form-label">Nombre del Tutor</label>
                <input type="text" class="form-control" id="nombreTutor" name="nombreTutor" placeholder="Ingrese el nombre del tutor" required>
            </div>
            <div class="mb-3">
                <label for="apellidoTutor" class="form-label">Apellido del Tutor</label>
                <input type="text" class="form-control" id="apellidoTutor" name="apellidoTutor" placeholder="Ingrese el apellido del tutor" required>
            </div>
            <div class="mb-3">
                <label for="telefonoTutor" class="form-label">Teléfono del Tutor</label>
                <input type="tel" class="form-control" id="telefonoTutor" name="telefonoTutor" placeholder="Ingrese el teléfono del tutor" required>
            </div>
        </div>
    `;

    // Al cambiar la fecha de nacimiento, verifica la edad y muestra u oculta campos
    fechaNacimientoInput.addEventListener("change", () => {
        const fechaNacimiento = new Date(fechaNacimientoInput.value);
        const edad = calcularEdad(fechaNacimiento);

        if (edad < 18) {
            tabContacto.style.display = "none";
            tabAdicional.style.display = "none";
            campoCedula.style.display = "none";

            // Agregar sección del tutor si no existe
            if (!document.getElementById("seccionTutor")) {
                seccionBasica.insertAdjacentHTML("beforeend", seccionTutorHTML);
            }

            // Deshabilitar la propiedad required de los campos ocultos
            setCamposRequired(false);
        } else {
            tabContacto.style.display = "block";
            tabAdicional.style.display = "block";
            campoCedula.style.display = "block";

            // Eliminar la sección del tutor si ya existe
            const seccionTutor = document.getElementById("seccionTutor");
            if (seccionTutor) {
                seccionTutor.remove();
            }

            // Habilitar la propiedad required de los campos visibles
            setCamposRequired(true);
        }
    });

    // Función para habilitar o deshabilitar campos requeridos
    function setCamposRequired(isRequired) {
        const campos = [
            document.getElementById("cedulaPaciente"),
            document.getElementById("telefonoPaciente"),
            document.getElementById("emailPaciente"),
            document.getElementById("direccionPaciente"),
            document.getElementById("contactoEmergencia"),
            document.getElementById("telefonoEmergencia")
        ];

        campos.forEach(campo => {
            if (campo) {
                campo.required = isRequired;
            }
        });
    }

    // Función para calcular la edad
    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        return edad;
    }
    /*
    // Mostrar los datos del formulario en la consola al enviar
    form.addEventListener("submit", (event) => {
        event.preventDefault();  // Evitar el envío del formulario para inspeccionar los datos primero

        const formData = new FormData(form);  // Crear un FormData con el formulario

        console.log("Datos del formulario:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Si todo está bien, puedes proceder con el envío del formulario
        // form.submit();  // Descomenta esto para enviar el formulario después de inspeccionar los datos
    });
    */
});
