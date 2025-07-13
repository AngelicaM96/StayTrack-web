const vistaReservas = document.querySelector("#vistaReservas");
const formularioReserva = document.querySelector("#formularioReserva");
const listaReservas = document.querySelector("#listaReservas");
const contenedorReservas = document.getElementById("contenedorReservas");

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const vista = params.get('vista');

    if (vista === 'todas') {
        formularioReserva.classList.add('hidden');
        listaReservas.classList.remove('hidden');
        renderizarReservas();
    } else {
        formularioReserva.classList.remove('hidden');
        listaReservas.classList.add('hidden');
    }
});

async function crearReserva() {
    const datos = {
        checkIn_reservas: document.getElementById('checkin').value,
        checkOut_reservas: document.getElementById('checkout').value,
        cedula_reserva: document.getElementById('idClienteReserva').value,
        nombre_reserva: document.getElementById('nombreReserva').value,
        apellido_reserva: document.getElementById('apellidoReserva').value,
        telefono_reserva: document.getElementById('telefonoReserva').value,
        ciudad_reserva: document.getElementById('ciudadReserva').value,
        correo_reserva: document.getElementById('correoReserva').value,
        Id_habitacion: document.getElementById('idHabitacionReserva').value,
        Id_hotel: 1,
        estado: 'pendiente'
    };

    
    for (const key in datos) {
        if (!datos[key]) {
            alert("Todos los campos son obligatorios.");
            return;
        }
    }

    try {
        const res = await fetch('/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const result = await res.json();

        if (res.ok) {
            alert("Reserva creada con éxito");
            window.location.href = "reservas.html?vista=todas";
        } else {
            alert("Error al crear reserva: " + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
}

async function renderizarReservas() {
    try {
        const res = await fetch('/api/reservas');
        const reservas = await res.json();

        contenedorReservas.innerHTML = '';

        reservas.forEach(reserva => {
            const div = document.createElement('div');
            div.classList.add('reserva-tarjeta');
            div.innerHTML = `
                <p><strong>Habitación:</strong> ${reserva.Id_habitacion}</p>
                <p><strong>Nombre:</strong> ${reserva.nombre_reserva}</p>
                <p><strong>Apellido:</strong> ${reserva.apellido_reserva}</p>
                <p><strong>Teléfono:</strong> ${reserva.telefono_reserva}</p>
                <p><strong>Ciudad:</strong> ${reserva.ciudad_reserva}</p>
                <p><strong>Correo:</strong> ${reserva.correo_reserva}</p>
                <p><strong>Check In:</strong> ${reserva.checkIn_reservas}</p>
                <p><strong>Check Out:</strong> ${reserva.checkOut_reservas}</p>
                <p><strong>Cliente:</strong> ${reserva.cedula_reserva}</p>
                <p><strong>Estado:</strong> ${reserva.estado}</p>
                <div style="margin-top: 10px;">
                    <button onclick="marcarEfectiva(${reserva.Id_reservas})">Reserva Efectiva</button>
                    <button onclick="cancelarReserva(${reserva.Id_reservas})">Cancelar</button>
                </div>
            `;
            contenedorReservas.appendChild(div);
        });
    } catch (error) {
        console.error("Error al cargar reservas:", error);
    }
}

async function marcarEfectiva(id) {
    try {
        const res = await fetch(`/api/reservas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            alert('Reserva marcada como efectiva');
            
            window.location.href = 'dashboard.html';
        } else {
            const result = await res.json();
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function cancelarReserva(id) {
    if (!confirm("¿Está seguro que desea cancelar la reserva?")) return;

    try {
        const res = await fetch(`/api/reservas/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Reserva cancelada');
            renderizarReservas();
        } else {
            const result = await res.json();
            alert('Error al cancelar: ' + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}