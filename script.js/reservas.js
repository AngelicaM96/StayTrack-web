const vistaReservas = document.querySelector("#vistaReservas");
const formularioReserva = document.querySelector("#formularioReserva");
const listaReservas = document.querySelector("#listaReservas");
const contenedorReservas = document.getElementById("contenedorReservas");

// llamamos a el URL
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const vista = params.get('vista');

    // en esta parte vamos a mostrar el contenedor de las reservas
    //vistaReservas.classList.remove('hidden'); 

    const formulario=document.getElementById('formularioReserva');
    const lista = document.getElementById('listaReservas');

    if (vista === 'todas') {
        formulario.classList.add('hidden');
        lista.classList.remove('hidden');
        renderizarReservas();
    } else {
        formulario.classList.remove('hidden');
        lista.classList.add('hidden');
    }
});

let reservas = JSON.parse(localStorage.getItem('reservas')) || [];


// En esta función vamos a crear las reservas 
function crearReserva() {
    const idReserva = document.getElementById('idReserva').value.trim();
    const nombreReserva = document.getElementById('nombreReserva').value.trim();
    const apellidoReserva = document.getElementById('apellidoReserva').value.trim();
    const telefonoReserva = document.getElementById('telefonoReserva').value.trim();
    const ciudadReserva = document.getElementById('ciudadReserva').value.trim();
    const correoReserva = document.getElementById('correoReserva').value.trim();
    const valorNocheReserva = document.getElementById('valorNocheReserva').value.trim();
    const checkin = document.getElementById('checkin').value.trim();
    const checkout = document.getElementById('checkout').value.trim();
    const idClienteReserva = document.getElementById('idClienteReserva').value.trim();
    const idHabitacionReserva = document.getElementById('idHabitacionReserva').value.trim();

    if (!idReserva || !checkin || !checkout || !idClienteReserva || !idHabitacionReserva || !nombreReserva || !apellidoReserva || !telefonoReserva || !ciudadReserva || !correoReserva) {
        alert('Por favor, llene todos los campos...');
        return;
    }

    const reserva = {
        idReserva,
        nombreReserva,
        apellidoReserva,
        telefonoReserva,
        ciudadReserva,
        correoReserva,
        valorNocheReserva,
        checkin,
        checkout,
        idClienteReserva,
        idHabitacionReserva,
        estado: 'pendiente'
    };

    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
    alert("Reserva creada con éxito");

    // Aquí cambiamos la vista a todas las reservas creadas
    window.location.href = "reservas.html?vista=todas";
}

// Renderizamos las reservas que se van a crear 
function renderizarReservas() {
    const contenedor = document.getElementById('contenedorReservas');
    contenedor.innerHTML = '';

    reservas.forEach((reserva, index) => {
        const div = document.createElement('div');
        div.classList.add('reserva-tarjeta');
        
        div.innerHTML = `
            <p><strong>Habitación:</strong> ${reserva.idHabitacionReserva}</p>
            <p><strong>Nombre:</strong> ${reserva.nombreReserva}</p>
            <p><strong>Apellido:</strong> ${reserva.apellidoReserva}</p>
            <p><strong>Teléfono:</strong> ${reserva.telefonoReserva}</p>
            <p><strong>Ciudad:</strong> ${reserva.ciudadReserva}</p>
            <p><strong>Correo:</strong> ${reserva.correoReserva}</p>
            <p><strong>Check In:</strong> ${reserva.checkin}</p>
            <p><strong>Check Out:</strong> ${reserva.checkout}</p>
            <p><strong>Cliente:</strong> ${reserva.idClienteReserva}</p>
            <p><strong>Valor por Noche:</strong> ${reserva.valorNocheReserva}</p>
            <p><strong>Estado:</strong> ${reserva.estado}</p>
            <div style="margin-top: 10px;">
                <button onclick="marcarEfectiva(${index})" style="margin-right: 10px;">Reserva Efectiva</button>
                <button onclick="cancelarReserva(${index})">Cancelar</button>
            </div>
        `;

        contenedor.appendChild(div);
    });
}


// Aquí si marcamos la reserva efectiva para ese día, pasa directamente a el panel de control como ocupada 
function marcarEfectiva(index) {
    const reserva = reservas[index];
    const habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

    const hab = habitaciones.find(h => h.id.toString() === reserva.idHabitacionReserva.toString());

    if (!hab) {
        alert("Habitación no se encontró");
        return;
    }

    if (hab.estado !== "disponible") {
        alert("La habitación no está disponible");
        return;
    }

    hab.estado = "ocupada";
    hab.huesped = {
        cedula: reserva.idClienteReserva,
        nombre: reserva.nombreReserva,
        apellido: reserva.apellidoReserva,
        telefono: reserva.telefonoReserva,
        ciudad: reserva.ciudadReserva,
        correo: reserva.correoReserva,
        valorNoche: reserva.valorNocheReserva
    };
    hab.noches = 1;
    hab.productos = [];

    reservas.splice(index, 1);

    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("Reserva agregada con éxito.");
    window.location.href = "dashboard.html";
}

// Con esta función atraves de un mensaje de confirmación podremos cancelar una reserva 
function cancelarReserva(index) {
    if (confirm("¿Está seguro que desea cancelar la reserva?")) {
        reservas.splice(index, 1);
        localStorage.setItem("reservas", JSON.stringify(reservas));
        renderizarReservas();
    }
}



