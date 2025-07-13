let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

const codigoInput = document.getElementById("codigoProducto");
const nombreInput = document.getElementById("nombreProducto");
const cantidadInput = document.getElementById("cantidadProducto");
const valorUnitarioInput = document.getElementById("valorProducto");
const tablaBody = document.getElementById("tablaProductos");

document.getElementById("btnGuardarProducto").addEventListener("click", agregarProducto);

function guardarInventario() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
}

function renderInventario() {
    const tablaBody = document.getElementById("tablaProductos");
    

    inventario.forEach((producto, index) => {
        const fila = document.createElement("tr");
        const valorTotal = producto.cantidad * producto.valorUnitario;

        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td><input value="${producto.nombre}" onchange="editarCampo(${index}, 'nombre', this.value)"></td>
            <td><input type="number" value="${producto.cantidad}" onchange="editarCampo(${index}, 'cantidad', this.value)"></td>
            <td><input type="number" value="${producto.valorUnitario}" onchange="editarCampo(${index}, 'valor', this.value)"></td>
            <td>$${valorTotal.toFixed(0)}</td>
            <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
        `;
        tablaBody.appendChild(fila);
    });
}

function agregarProducto() {
    const codigo = codigoInput.value.trim();
    const nombre = nombreInput.value.trim();
    const cantidad = parseInt(cantidadInput.value.trim());
    const valorUnitario = parseFloat(document.getElementById("valorUnitarioProducto").value.trim());

    if (!codigo || !nombre || isNaN(cantidad) || isNaN(valorUnitario)) {
        alert("Hay campos vacíos, llene todos los campos por favor!!.");
        return;
    }

    const indexExistente = inventario.findIndex(p => p.codigo === codigo);

    //Condicionamos si el producto ya existe modificamos el valor y las cantidades

    if (indexExistente !== -1) {
        inventario[indexExistente].cantidad += cantidad;

        if (inventario[indexExistente].valorUnitario !== valorUnitario) {
            inventario[indexExistente].valorUnitario = valorUnitario;
        }
    } else {
        inventario.push({ codigo, nombre, cantidad, valorUnitario });
    }

    guardarInventario();
    renderInventario();

    
    codigoInput.value = "";
    nombreInput.value = "";
    cantidadInput.value = "";
    document.getElementById("valorUnitarioProducto").value = "";
}


function eliminarProducto(index) {
    if (confirm("¿Quieres eliminar este producto?")) {
        inventario.splice(index, 1);
        guardarInventario();
        renderInventario();
    }
}

function editarCampo(index, campo, valor) {
    if (campo === 'cantidad' || campo === 'valor') {
        valor = parseFloat(valor);
        if (isNaN(valor)) return;
    }
    inventario[index][campo] = valor;
    guardarInventario();
    renderInventario();
}

function imprimirInventario() {

    let texto = "INVENTARIO ACTUAL - Hotel Resort de Kaley\n\n";
    inventario.forEach(p => {
        const total = p.cantidad * p.valorUnitario;
        texto += `Codigo: ${p.codigo} | 
        Producto: ${p.nombre} | 
        Cantidad: ${p.cantidad} | 
        Valor Unitario: $${p.valorUnitario} | 
        Total: $${total}\n`;
    });
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`<pre>${texto}</pre>`);
    ventana.print();
    ventana.close();
}

document.getElementById("btnAgregar").addEventListener("click", agregarProducto);
document.getElementById("btnImprimir").addEventListener("click", imprimirInventario);
document.getElementById("btnSalir").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

document.getElementById("btnGuardarProducto").addEventListener("click", agregarProducto);
document.addEventListener("DOMContentLoaded", renderInventario);
