let facturas = JSON.parse(localStorage.getItem("facturas")) || [];

const tabla = document.getElementById("tablaFacturas");
const buscarHuesped = document.getElementById("buscarHuesped");
const buscarMes = document.getElementById("buscarMes");

function renderizarFacturas() {
    tabla.innerHTML = "";

    let resultados = facturas;

    const id = buscarHuesped.value.trim().toLowerCase();
    const mes = buscarMes.value;

    if (id) {
    resultados = resultados.filter(f => f.idHuesped.toLowerCase().includes(id));
    }

    if (mes) {
    resultados = resultados.filter(f => f.fecha.startsWith(mes));
    }

    resultados.forEach((factura, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${factura.numero}</td>
        <td>${factura.nombre}</td>
        <td><button onclick="verFactura(${index})">Imprimir</button></td>
        <td><button onclick="editarFactura(${index})">Editar</button></td>
    `;
    tabla.appendChild(fila);
    });
}

function verFactura(index) {
    const factura = facturas[index];
    const modal = document.getElementById("modalFactura");
    const detalle = document.getElementById("detalleFactura");

    detalle.innerHTML = `
    <h2>Factura #${factura.numero}</h2>
    <p><strong>Nombre:</strong> ${factura.nombre}</p>
    <p><strong>ID Huésped:</strong> ${factura.cedula}</p>
    <p><strong>Fecha:</strong> ${factura.fecha}</p>
    <p><strong>Noches:</strong> ${factura.noches}</p>
    <p><strong>Productos:</strong> ${factura.productos.join(", ")}</p>
    <p><strong>Total:</strong> $${factura.total}</p>
    `;
    modal.classList.remove("hidden");
}

function cerrarModal() {
    document.getElementById("modalFactura").classList.add("hidden");
}

function editarFactura(index) {
    const factura = facturas[index];

    const nuevoNombre = prompt("Editar nombre del huésped:", factura.nombre);
    const nuevasNoches = parseInt(prompt("Editar número de noches:", factura.noches), 10);
    const nuevosProductos = prompt("Editar productos separados por coma:", factura.productos.join(","));

    if (nuevoNombre && !isNaN(nuevasNoches) && nuevosProductos !== null) {
    factura.nombre = nuevoNombre;
    factura.noches = nuevasNoches;
    factura.productos = nuevosProductos.split(",");
    

    localStorage.setItem("facturas", JSON.stringify(facturas));
    renderizarFacturas();
    alert("Factura actualizada");
    }
}

buscarHuesped.addEventListener("input", renderizarFacturas);
buscarMes.addEventListener("input", renderizarFacturas);

window.onload = renderizarFacturas;
