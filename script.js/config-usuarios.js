
const inputId = document.getElementById("idUsuario");
const inputNombre = document.getElementById("nombreUsuario");
const inputUsuario = document.getElementById("usuario");
const inputContrasena = document.getElementById("contrasena");
const inputRol = document.getElementById("rolUsuario");
const btnGuardarUsuario = document.getElementById("btnGuardarUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", renderizarUsuarios);

btnGuardarUsuario.addEventListener("click", () => {
    const id = inputId.value.trim();
    const nombre = inputNombre.value.trim();
    const usuario = inputUsuario.value.trim();
    const contrasena = inputContrasena.value.trim();
    const rol = inputRol.value;

    if (!id || !nombre || !usuario || !contrasena || !rol) {
        alert("Hay campos vacíos, por favor completa todos los campos.");
        return;
    }

    
    const existe = usuarios.some((u, index) => u.usuario === usuario && index !== editandoIndex);
    if (existe) {
        alert("Ya existe un usuario con ese nombre de usuario. Por favor elige otro.");
        return;
    }

    const nuevoUsuario = { id, nombre, usuario, contrasena, rol };

    if (editandoIndex !== null) {
        usuarios[editandoIndex] = nuevoUsuario;
        editandoIndex = null;
        btnGuardarUsuario.textContent = "Guardar";
    } else {
        usuarios.push(nuevoUsuario);
    }

    guardarUsuarios();
    limpiarFormulario();
    renderizarUsuarios();
});

function renderizarUsuarios() {
    tablaUsuarios.innerHTML = "";
    usuarios.forEach((usuario, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.rol}</td>
            <td>
                <button class="editar" onclick="editarUsuario(${index})">Editar</button>
                <button class="eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
            </td>
        `;
        tablaUsuarios.appendChild(fila);
    });
}


window.editarUsuario = function(index) {
    const usuario = usuarios[index];
    inputId.value = usuario.id;
    inputNombre.value = usuario.nombre;
    inputUsuario.value = usuario.usuario;
    inputContrasena.value = usuario.contrasena;
    inputRol.value = usuario.rol;
    editandoIndex = index;
    btnGuardarUsuario.textContent = "Actualizar";
};


window.eliminarUsuario = function(index) {
    if (confirm("¿Estás seguro que deseas eliminar este usuario?")) {
        usuarios.splice(index, 1);
        guardarUsuarios();
        renderizarUsuarios();
    }
};


function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}


function limpiarFormulario() {
    inputId.value = "";
    inputNombre.value = "";
    inputUsuario.value = "";
    inputContrasena.value = "";
    inputRol.value = "recepcionista";
}
