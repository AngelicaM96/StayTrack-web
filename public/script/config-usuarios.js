let modoEdicion = false;
let usuarioEditandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();

    document.getElementById('formUsuario').addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const rol = document.getElementById('rol').value;

        if (!nombre || !usuario || !contrasena || !rol) {
            alert('Por favor completa todos los campos.');
            return;
        }

        const datos = {
            nombre_usuario: nombre,
            usuario,
            contrasena,
            rol
        };

        if (modoEdicion && usuarioEditandoId) {
            fetch(`/api/usuarios/${usuarioEditandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(response => {
                alert(response.mensaje || "Usuario actualizado.");
                resetFormulario();
                cargarUsuarios();
            })
            .catch(err => console.error('Error al actualizar:', err));
        } else {
            datos.id_rol = rol === "administrador" ? 1 : 4;
            datos.id_hotel = 1; 

            fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(response => {
                alert(response.mensaje || "Usuario creado.");
                resetFormulario();
                cargarUsuarios();
            })
            .catch(err => console.error('Error al guardar:', err));
        }
    });
});

function cargarUsuarios() {
    fetch('/api/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const tabla = document.getElementById('tablaUsuarios');
            tabla.innerHTML = '';

            usuarios.forEach(u => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${u.Nombre_usuario}</td>
                    <td>${u.Usuario}</td>
                    <td>${u.Nombre_rol}</td>
                    <td>
                        <button class="editar" onclick="editarUsuario(${u.Id_usuario}, '${u.Nombre_usuario}', '${u.Usuario}', '${u.Nombre_rol}')">Editar</button>
                        <button class="eliminar" onclick="eliminarUsuario(${u.Id_usuario})">Eliminar</button>
                    </td>`;
                tabla.appendChild(fila);
            });
        });
}

function editarUsuario(id, nombre_usuario, usuario, nombre_rol) {
    document.getElementById('nombre').value = nombre_usuario;
    document.getElementById('usuario').value = usuario;
    document.getElementById('rol').value = nombre_rol.toLowerCase();

    
    document.getElementById('contrasena').value = "";

    usuarioEditandoId = id;
    modoEdicion = true;
    document.getElementById('btn-guardar').textContent = 'Actualizar';
}

function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    fetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            alert('Usuario eliminado correctamente.');
            cargarUsuarios();
        } else {
            alert('Error al eliminar usuario.');
        }
    });
}

function resetFormulario() {
    document.getElementById('formUsuario').reset();
    modoEdicion = false;
    usuarioEditandoId = null;
    document.getElementById('btn-guardar').textContent = 'Guardar';
}

