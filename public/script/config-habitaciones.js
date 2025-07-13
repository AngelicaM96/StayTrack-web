const listaHabitaciones = document.getElementById("listaHabitaciones");
const nuevaHabitacionInput = document.getElementById("nuevaHabitacionInput");
const btnAgregar = document.getElementById("btnAgregarHabitacion");

async function cargarHabitaciones() {
    try {
        const res = await fetch('/api/habitaciones');
        const habitaciones = await res.json();

        listaHabitaciones.innerHTML = "";
        if (habitaciones.length === 0) {
            listaHabitaciones.innerHTML = "<li>No hay habitaciones registradas.</li>";
            return;
        }

        habitaciones.forEach((hab) => {
            const li = document.createElement("li");
            li.innerHTML = `
                Habitación ${hab.numero} - Estado: ${hab.estado}
                <button onclick="eliminarHabitacion(${hab.id})">Eliminar</button>`;
            listaHabitaciones.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
    }
}

async function agregarHabitacion() {
    const id = parseInt(nuevaHabitacionInput.value);
    if (isNaN(id)) {
        alert("Ingrese el Número de la Nueva Habitación");
        return;
    }

    try {
        const res = await fetch('/api/habitaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero_habitacion: id, id_estado: 1, id_hotel: 1 }) // Ajusta id_hotel según tu sistema
        });

        const data = await res.json();
        if (data.mensaje) {
            alert(data.mensaje);
        } else {alert("Habitación agregada, pero no se recibió mensaje del servidor.");
}

        nuevaHabitacionInput.value = "";
        cargarHabitaciones();
    } catch (error) {
        console.error("Error al agregar habitación:", error);
    }
}

async function eliminarHabitacion(id) {
    if (!confirm("¿Esta seguro que desea eliminar esta habitación?")) return;

    try {
        const res = await fetch(`/api/habitaciones/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        alert(data.mensaje);
        cargarHabitaciones();
    } catch (error) {
        console.error("Error al eliminar habitación:", error);
    }
}

btnAgregar.addEventListener("click", agregarHabitacion);
document.addEventListener("DOMContentLoaded", cargarHabitaciones);
