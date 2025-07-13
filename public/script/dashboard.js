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

    
    const habitacionesOrdenadas = [...habitaciones].sort((a, b) => a.id - b.id);

    habitacionesOrdenadas.forEach((hab) => {
        const div = document.createElement("div");

        
        div.className = `habitacion ${hab.estado}`;  
        
        div.innerHTML = `<h3>Habitación ${100 + hab.id}</h3><p>${
            hab.estado === 'disponible' ? 'Disponible' :
            hab.estado === 'sucia' ? 'Sucia' :
            hab.estado === 'mantenimiento' ? 'En Mantenimiento' :
            hab.huesped ? `Ocupada por ${hab.huesped.nombre}` : 'Ocupada'
        }</p>`;

        
        div.onclick = () => {
            habitacionSeleccionada = hab;

            if (hab.estado === 'disponible') {
                abrirModal();

            } else if (hab.estado === 'ocupada') {
                if (hab.huesped || hab.nombreHuesped) {
                    mostrarInfo();
                } else {
                    alert("Esta habitación está ocupada pero no tiene datos del huésped registrados.");
                }

            } else if (hab.estado === 'sucia') {
                const confirmar = confirm(`¿Marcar la habitación ${100 + hab.id} como disponible?`);
                if (confirmar) {
                    hab.estado = 'disponible';

                    
                    fetch(`/api/habitaciones/${hab.id}/estado`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ estado: 1 }) 
                    }).then(() => {
                        obtenerHabitaciones(); 
                    });
                }

            } else if (hab.estado === 'mantenimiento') {
                alert(`Habitación ${100 + hab.id} está en mantenimiento. No se puede registrar huésped aún.`);
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

function mostrarInfo() {
    const hab = habitacionSeleccionada;
    const huesped = hab.huesped || {
        cedula: hab.cedula_huesped || hab.cedula,
        nombre: hab.Nombre_huesped || hab.nombre,
        apellido: hab.Apellido_huesped || hab.apellido,
        telefono: hab.Telefono_huesped || hab.telefono,
        ciudad: hab.Ciudad_huesped || hab.ciudad,
        correo: hab.Correo_huesped || hab.correo,
        valorNoche: hab.valor_noche || hab.valorNoche || 0
    };

    const noches = hab.noches || hab.noches_hospedaje || 1;
    const productos = hab.productos || [];

    const totalProductos = hab.productos.reduce((acc, p) => acc + (p.valor * p.cantidad), 0);
    const total = hab.noches * huesped.valorNoche + totalProductos;

    datosHuesped.innerHTML = `
        <p><strong>No. Cédula:</strong> ${huesped.cedula}</p>
        <p><strong>Nombre:</strong> ${huesped.nombre}</p>
        <p><strong>Apellido:</strong> ${huesped.apellido}</p>
        <p><strong>Teléfono:</strong> ${huesped.telefono}</p>
        <p><strong>Ciudad:</strong> ${huesped.ciudad}</p>
        <p><strong>Correo:</strong> ${huesped.correo}</p>
        <p><strong>Valor Noche:</strong> $${huesped.valorNoche}</p>
        <p><strong>Noches Hospedado:</strong> ${noches}</p>
        <p><strong>Productos:</strong> ${productos.map(p => `${p.nombre} x${p.cantidad} ($${p.valor})`).join(", ") || 'Ninguno'}</p>
        <p><strong>Total a Pagar:</strong> $${total}</p>`;

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


const facturaGuardar = {
    Nit_cedula: huesped.cedula,
    Id_cliente: huesped.cedula,
    nombre_cliente: `${huesped.nombre} ${huesped.apellido}`,
    noches: hab.noches,
    valor_noche: huesped.valorNoche,
    valor_productos: totalProductos,
    total_pago: total,
    Id_habitacion: hab.id,
    Id_hotel: 1
};

fetch('/api/facturas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(facturaGuardar)
})
.then(response => response.json())
.then(data => {
    console.log('Factura guardada al imprimir:', data);
})
.catch(error => {
    console.error('Error al guardar factura al imprimir:', error);
});


facturas.push(nuevaFactura);
localStorage.setItem("facturas", JSON.stringify(facturas));


    const nuevaVentana = window.open("", "_blank", "width=600,height=700");
    nuevaVentana.document.write(`<pre>${factura}</pre>`);
    nuevaVentana.document.write(`<script>window.print();</script>`);

}

async function checkOut() {
    if (confirm("¿Confirmar Check Out del huésped?")) {
        const hab = habitacionSeleccionada;
        const huesped = hab.huesped;

        
        const totalProductos = hab.productos.reduce((acc, p) => acc + (p.valor * p.cantidad), 0);
        const total = hab.noches * huesped.valorNoche + totalProductos;

        
        const factura = {
            Nit_cedula: huesped.cedula,
            Id_cliente: huesped.cedula,
            nombre_cliente: `${huesped.nombre} ${huesped.apellido}`,
            noches: hab.noches,
            valor_noche: huesped.valorNoche,
            valor_productos: totalProductos,
            total_pago: total,
            Id_habitacion: hab.id,
            Id_hotel: 1 
        };

        try {
            const resFactura = await fetch('/api/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(factura)
            });

            const data = await resFactura.json();
            console.log('Factura guardada:', data);

            
            await fetch(`/api/habitaciones/${hab.id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 3 }) 
            });

            
            await fetch(`/api/huespedes/${hab.id}`, {
                method: 'DELETE'
            });

            
            cerrarInfo();
            await obtenerHabitaciones(); 
        } catch (error) {
            console.error('Error durante el check-out:', error);
        }
    }
}



let habitaciones = [];

async function obtenerHabitaciones() {
    try {
        const res = await fetch('/api/habitaciones');
        habitaciones = await res.json();
        renderHabitaciones();
    } catch (error) {
        console.error('Error al cargar habitaciones desde el servidor:', error);
    }
}


function toggleSubmenu() {
    const submenu = document.getElementById('submenuReservas');
    submenu.classList.toggle('hidden');
}


obtenerHabitaciones(); 
