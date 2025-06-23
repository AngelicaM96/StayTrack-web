
document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();

    const hotelIngresado = document.getElementById("hotel").value.trim().toLowerCase();
    const usuarioIngresado = document.getElementById("usuario").value.trim();
    const contrasenaIngresada = document.getElementById("contrasena").value;

    const hoteles = JSON.parse(localStorage.getItem("hoteles")) || [];
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const hotelValido = hoteles.find(h => h.nombre.toLowerCase() === hotelIngresado || h.id.toLowerCase() === hotelIngresado);

    if (!hotelValido) {
        document.getElementById("mensajeError").textContent = "No se encontro el Hotel.";
        return;
    }

    const usuarioValido = usuarios.find(u => u.usuario === usuarioIngresado && u.contrasena === contrasenaIngresada);

    if (!usuarioValido) {
        document.getElementById("mensajeError").textContent = "Usuario o contraseña incorrectos.";
        return;
    }


    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));

    

    
    window.location.href = "dashboard.html";
});

