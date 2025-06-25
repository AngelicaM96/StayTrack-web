const habitacionesContainer = document.querySelector(".habitaciones");
const modal = document.getElementById("modal");
const infoModal= document.getElementById("infoHuesped")
const datosHuesped= document.getElementById("datosHuesped");

const inputCedulaHuesped = document.getElementById("cedulaHuesped");
const inputNombreHuesped = document.getElementById("nombreHuesped");
const inputApellidoHuesped = document.getElementById("apellidoHuesped");
const inputTelefonoHuesped = document.getElementById("telefonoHuesped");
const inputCiudadHuesped = document.getElementById("ciudadHuesped");
const inputCorreoHuesped = document.getElementById("correoHuesped");
const inputValorNoche = document.getElementById("valorNoche");

let habitacionSeleccionada = null;



function renderHabitaciones() {
    habitacionesContainer.innerHTML = "";
    habitaciones.forEach((hab) => {
        const div = document.createElement("div");
        div.className = `habitacion ${hab.estado}`;
        div.innerHTML = `<h3>Habitación ${hab.id}</h3><p>${hab.estado === 'disponible' ? 'Disponible' : hab.estado === 'Sucia' ? 'Sucia' : hab.estado === 'mantenimiento' ? 'En Mantenimiento' : hab.huesped ? `Ocupada por ${hab.huesped.nombre}`: 'Ocupada'}</p>`;

        div.onclick = () => {
            habitacionSeleccionada= hab;
            if (hab.estado === 'disponible') {
                abrirModal();
            } else  if(hab.estado === 'ocupada'){
                mostrarInfo();
            } else if(hab.estado === 'Sucia'){
                const confirmar = confirm(`¿Marcar la habitación ${hab.id} como disponible?`);
                if (confirmar){
                    hab.estado= 'disponible';
                    renderHabitaciones();
                }
            } else if(hab.estado === 'mantenimiento'){
                alert(`Habitación ${hab.id} está en mantenimiento. No se puede registrar huésped aún.`);

            }        
        };

    habitacionesContainer.appendChild(div);
    });
}

function abrirModal() {
    modal.classList.remove("hidden");
    inputCedulaHuesped.value = "";
    inputNombreHuesped.value = "";
    inputApellidoHuesped.value = "";
    inputTelefonoHuesped.value = "";
    inputCorreoHuesped.value = "";
    inputCiudadHuesped.value = "";
    inputValorNoche.value = "";
}

function cerrarModal() {
    modal.classList.add("hidden");
}

function registrarHuesped() {
    console.log("Registrar Huesped...");
    const cedula = inputCedulaHuesped.value.trim();
    const nombre= inputNombreHuesped.value.trim();
    const apellido = inputApellidoHuesped.value.trim();
    const telefono = inputTelefonoHuesped.value.trim();
    const ciudad = inputCiudadHuesped.value.trim();
    const correo = inputCorreoHuesped.value.trim();
    const valorNoche = parseFloat(inputValorNoche.value);

    if (cedula && nombre && apellido && telefono && ciudad && correo && valorNoche && habitacionSeleccionada) {
        habitacionSeleccionada.estado = 'ocupada';
        habitacionSeleccionada.huesped = {
            cedula,
            nombre,
            apellido,
            telefono,
            ciudad,
            correo,
            valorNoche};
        habitacionSeleccionada.noches = 1;
        habitacionSeleccionada.productos= [];
        renderHabitaciones();
        cerrarModal();
    }
}

function mostrarInfo(){
    const hab= habitacionSeleccionada;
    const huesped= hab.huesped;
    const totalProductos= hab.productos.reduce((acc, p) => acc + (p.valor * p.cantidad), 0);
    const total= hab.noches * huesped.valorNoche + totalProductos;

    datosHuesped.innerHTML = `
        <p><strong>No. Cedula:</strong> ${huesped.cedula}</p>
        <p><strong>Nombre:</strong> ${huesped.nombre}</p>
        <p><strong>Apellido:</strong> ${huesped.apellido}</p>
        <p><strong>Teléfono:</strong> ${huesped.telefono}</p>
        <p><strong>Ciudad:</strong> ${huesped.ciudad}</p>
        <p><strong>Correo:</strong> ${huesped.correo}</p>
        <p><strong>Valor Noche:</strong> ${huesped.valorNoche}</p>
        <p><strong>Noches Hospedado:</strong> ${hab.noches}</p>
        <p><strong>Productos:</strong> ${hab.productos.map(p=>`${p.nombre} x${p.cantidad} ($${p.valor})`).join(", ") || 'Ninguno'}</p>
        <p><strong>Total debe:</strong> $${total}</p>`;

    infoModal.classList.remove("hidden");
}

function cerrarInfo(){
    infoModal.classList.add("hidden");
}

function agregarNoche(){
    habitacionSeleccionada.noches++;
    mostrarInfo();
}

function agregarProducto(){
    const nombre= prompt("Nombre del Producto:");
    const cantidad= parseInt(prompt("Cantidad:"));
    const valor= parseFloat(prompt("Valor por Unidad:"));

    if(nombre && !isNaN(cantidad) && !isNaN(valor)){
        habitacionSeleccionada.productos.push({ nombre, cantidad, valor});
        mostrarInfo();
    }
}


function imprimirFactura(){
    const hab= habitacionSeleccionada;
    const huesped= hab.huesped;
    const totalProductos= hab.productos.reduce((acc, p) => acc + (p.valor * p.cantidad), 0);
    const total= hab.noches * huesped.valorNoche + totalProductos;

    const factura = `
    FACTURA STAYTRACK  - HOTEL RESORT DE KALEY
    ------------------------------------

    Habitación: ${hab.id}
    Nombre: ${huesped.nombre} ${huesped.apellido}
    Cedula: ${huesped.cedula}
    Teléfono: ${huesped.telefono}
    Ciudad: ${huesped.ciudad}
    Correo: ${huesped.correo}


    Noches Hospedadas: ${hab.noches}
    Valor por Noche: $${huesped.valorNoche}
    Productos: 
    ${hab.productos.map(p => ` - ${p.nombre} x${p.cantidad} ($${p.valor})`).join("\n")}

    TOTAL A PAGAR: $${total}

    `;

    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const nuevaFactura = {
        numero: Date.now(),
        fecha: new Date().toLocaleString(),
        habitacion: hab.id,
        nombre: huesped.nombre + " " + huesped.apellido,
        cedula: huesped.cedula,
        noches: hab.noches,
        valorNoche: huesped.valorNoche,
        productos: hab.productos,
        total: total
};

facturas.push(nuevaFactura);
localStorage.setItem("facturas", JSON.stringify(facturas));


    const nuevaVentana = window.open("", "_blank", "width=600,height=700");
    nuevaVentana.document.write(`<pre>${factura}</pre>`);
    nuevaVentana.document.write(`<script>window.print();</script>`);

}

function checkOut(){
    if(confirm("¿Confirmar Check Out del huésped?")){
        habitacionSeleccionada.estado="Sucia";
        habitacionSeleccionada.huesped= null;
        habitacionSeleccionada.noches= 0;
        habitacionSeleccionada.productos= [];
        cerrarInfo();
        renderHabitaciones();
    }
}


let habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || Array.from({ length: 32 }, (_, i) => ({
    id: 101 + i,
    estado: 'disponible',
    huesped: null,
    noches: 0,
    productos: []
}));


function toggleSubmenu() {
    const submenu = document.getElementById('submenuReservas');
    submenu.classList.toggle('hidden');
}


renderHabitaciones();
