
document.addEventListener("DOMContentLoaded", () => {
    
});


function cerrarSesion() {
    const confirmar = confirm("¿Estás seguro de que quieres cerrar la sesión?");
    if (confirmar) { 
        window.location.href = "login.html";
    }
}

function salir(){
    window.location.href= "dashboard.html";
}
