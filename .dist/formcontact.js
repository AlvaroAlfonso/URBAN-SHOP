document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    const nombre = document.querySelector('#nombre');
    const apellidos = document.querySelector('#apellidos');
    const telefono = document.querySelector('#telefono');
    const correo = document.querySelector('#correo');
    const mensajeInput = document.querySelector('#mensaje');
    const botonEnviar = form.querySelector('button[type="submit"]');

    // Crear mensaje
    function crearMensaje(tipo, texto, id) {
        const div = document.createElement('div');
        div.textContent = texto;
        div.style.color = 'white';
        div.style.backgroundColor = tipo === 'error' ? '#e74c3c' : '#27ae60';
        div.style.padding = '5px 10px';
        div.style.marginBottom = '5px';
        div.style.fontSize = '14px';
        div.style.borderRadius = '5px';
        div.id = `mensaje-${id}`;
        return div;
    }

    // Eliminar mensaje por ID
    function eliminarMensaje(id) {
        const mensajeElemento = document.querySelector(`#mensaje-${id}`);
        if (mensajeElemento) mensajeElemento.remove();
    }

    // Mostrar mensaje éxito
    function mostrarMensajeExito() {
        const exitoMensaje = document.createElement('div');
        exitoMensaje.textContent = "¡Formulario enviado exitosamente!";
        exitoMensaje.style.color = 'white';
        exitoMensaje.style.backgroundColor = '#27ae60';
        exitoMensaje.style.padding = '10px 20px';
        exitoMensaje.style.marginTop = '20px';
        exitoMensaje.style.fontSize = '16px';
        exitoMensaje.style.fontWeight = 'bold';
        exitoMensaje.style.textAlign = 'center';
        exitoMensaje.style.borderRadius = '5px';
        form.insertAdjacentElement('beforebegin', exitoMensaje);
    }

    // Mostrar loader en botón
    function mostrarCargando() {
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
    }

    // Restaurar botón
    function restaurarBoton() {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "ENVIAR AHORA";
    }

    // Validaciones
    function validarNombre() {
        eliminarMensaje('nombre');
        const regex = /^[a-zA-Z\s]+$/;
        if (nombre.value.trim() === "") {
            nombre.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa tu nombre.", 'nombre'));
            return false;
        } else if (!regex.test(nombre.value)) {
            nombre.insertAdjacentElement('beforebegin', crearMensaje('error', "El nombre no debe contener números o caracteres especiales.", 'nombre'));
            return false;
        }
        return true;
    }

    function validarApellidos() {
        eliminarMensaje('apellidos');
        if (apellidos.value.trim() === "") {
            apellidos.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa tus apellidos.", 'apellidos'));
            return false;
        }
        return true;
    }

    function validarTelefono() {
        eliminarMensaje('telefono');
        const valor = telefono.value.trim();
        if (valor === "") {
            telefono.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa tu número telefónico.", 'telefono'));
            return false;
        }
        if (valor.length !== 10 || isNaN(valor)) {
            telefono.insertAdjacentElement('beforebegin', crearMensaje('error', "El número telefónico debe contener exactamente 10 dígitos numéricos.", 'telefono'));
            return false;
        }
        return true;
    }

    function validarCorreo() {
        eliminarMensaje('correo');
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (correo.value.trim() === "") {
            correo.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa tu correo electrónico.", 'correo'));
            return false;
        } else if (!regex.test(correo.value)) {
            correo.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa un correo electrónico válido.", 'correo'));
            return false;
        }
        return true;
    }

    function validarMensaje() {
        eliminarMensaje('mensaje');
        if (mensajeInput.value.trim() === "") {
            mensajeInput.insertAdjacentElement('beforebegin', crearMensaje('error', "Por favor, ingresa tu mensaje.", 'mensaje'));
            return false;
        }
        return true;
    }

    // Envío del formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        document.querySelectorAll('[id^="mensaje-"]').forEach(e => e.remove());

        let esValido = true;
        esValido = validarNombre() && esValido;
        esValido = validarApellidos() && esValido;
        esValido = validarTelefono() && esValido;
        esValido = validarCorreo() && esValido;
        esValido = validarMensaje() && esValido;

        if (esValido) {
            mostrarCargando(); // Muestra "Enviando..."

            const data = {
                nombre: nombre.value,
                apellidos: apellidos.value,
                telefono: telefono.value,
                correo: correo.value,
                mensaje: mensajeInput.value
            };

            fetch("http://localhost:8080/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                restaurarBoton();
                if (res.ok) {
                    mostrarMensajeExito();
                    form.reset();
                } else {
                    alert("Error al enviar el formulario. Intenta de nuevo.");
                }
            })
            .catch(err => {
                restaurarBoton();
                console.error("Error de red:", err);
                alert("No se pudo enviar. Verifica tu conexión.");
            });
        }
    });
});
