
let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

const listaHabitaciones = document.getElementById("listaHabitaciones");
const nuevaHabitacionInput = document.getElementById("nuevaHabitacionInput");
const btnAgregar = document.getElementById("btnAgregarHabitacion");

function guardarHabitaciones() {
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
}

function renderHabitaciones() {
    listaHabitaciones.innerHTML = "";

    if (habitaciones.length === 0) {
        listaHabitaciones.innerHTML = "<li>No hay habitaciones registradas.</li>";
        return;
    }

    habitaciones.forEach((hab, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            Habitación ${hab.id} - Estado: ${hab.estado}
            <button onclick="eliminarHabitacion(${index})">Eliminar</button>`;
        listaHabitaciones.appendChild(li);
    });
}

function agregarHabitacion() {
    const id = parseInt(nuevaHabitacionInput.value);
    if (isNaN(id)) {
        alert("Ingrese el Número de la Nueva Habitación");
        return;
    }

    if (habitaciones.some(h => h.id === id)) {
        alert("Esa habitación ya existe, por favor registre otro Número");
        return;
    }

    const nueva = {
        id,
        estado: "disponible",
        huesped: null,
        noches: 0,
        productos: []
    };

    habitaciones.push(nueva);
    guardarHabitaciones();
    renderHabitaciones();
    nuevaHabitacionInput.value = "";
}

function eliminarHabitacion(index) {
    if (confirm("¿Esta seguro que desea eliminar esta habitación?")) {
        habitaciones.splice(index, 1);
        guardarHabitaciones();
        renderHabitaciones();
    }
}

btnAgregar.addEventListener("click", agregarHabitacion);


renderHabitaciones();
