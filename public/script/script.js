document.querySelector(".btn-login").addEventListener("click", async (e) => {
    e.preventDefault(); // evita el envío por formulario tradicional

    const hotel = document.getElementById("hotel").value;
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    try {
        const respuesta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ hotel, usuario, contrasena })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            window.location.href = data.redirigir;
        } else {
            document.getElementById("mensajeError").textContent = data.error;
        }

    } catch (error) {
        document.getElementById("mensajeError").textContent = "Error de conexión con el servidor";
        console.error("Error:", error);
    }
});

