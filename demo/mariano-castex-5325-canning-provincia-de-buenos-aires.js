
// Array para almacenar los productos en el carrito
var carrito = [];
var direccion = "";
var medioPago = "";
var numeroWhatsApp = "1123384618"; // 

function agregarAlCarrito(nombre, precio) {
    var cantidad = parseInt(prompt("Ingrese la cantidad de " + nombre + ":", "1"));
    if (!isNaN(cantidad) && cantidad > 0) {
        var productoExistenteIndex = carrito.findIndex(function (producto) {
            return producto.nombre === nombre;
        });

        if (productoExistenteIndex !== -1) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            carrito[productoExistenteIndex].cantidad += cantidad;
        } else {
            // Si el producto no está en el carrito, agregarlo
            carrito.push({ id: carrito.length + 1, nombre: nombre, cantidad: cantidad, precio: precio });
        }

        // Actualizar la visualización del carrito
        actualizarCarrito();
    } else {
        alert("La cantidad ingresada no es válida.");
    }
}


// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (producto) {
        return producto.id !== id;
    });
    actualizarCarrito();
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    if (carrito.length === 0) {
        document.getElementById("carrito").innerHTML = "<p>El carrito está vacío, mire <a href='#titulo-productos'>Nuestros productos.</a></p>";
        document.getElementById("carrito-terminar-pedido").style.display = "none"; // Ocultar el elemento
        return;
    }

    var carritoHTML = "<ul>";
    var total = 0;
    carrito.forEach(function (producto) {
        var subtotal = producto.cantidad * producto.precio;
        carritoHTML += "<li>" + producto.cantidad + "x " + producto.nombre + " - Precio unitario: " + producto.precio + "$ - Subtotal: " + subtotal + "$" +
            "<div> <button class='button button1' onclick=\"editarProducto(" + producto.id + ")\">Editar</button>" +
            "<button class='button button1' onclick=\"eliminarDelCarrito(" + producto.id + ")\">Eliminar</button></div></li>";
        total += subtotal;
    });
    carritoHTML += "</ul>";
    carritoHTML += "<p>El total es: " + total + "$</p>";
    document.getElementById("carrito").innerHTML = carritoHTML;
    document.getElementById("carrito-terminar-pedido").style.display = "block"; // Mostrar el elemento
}


// Llamar a actualizarCarrito() cuando se carga la página por primera vez
window.onload = function() {
    actualizarCarrito();
};



// Función para editar la cantidad de un producto en el carrito
function editarProducto(id) {
    var nuevoCantidad = parseInt(prompt("Ingrese la nueva cantidad:"));
    if (!isNaN(nuevoCantidad) && nuevoCantidad > 0) {
        var producto = carrito.find(function (p) {
            return p.id === id;
        });
        producto.cantidad = nuevoCantidad;
        actualizarCarrito();
    } else {
        alert("La cantidad ingresada no es válida.");
    }
}

function solicitarDireccion() {
    direccion = prompt("Ingrese direccion, localidad y entre calles");
    while (direccion === "") {
        direccion = prompt("Por favor, ingrese una dirección válida:");
    }
}


// Función para seleccionar el medio de pago
function seleccionarMedioPago() {
    var selectMedioPago = document.getElementById("medioPago");
    medioPago = selectMedioPago.value;
}

// Función para calcular el total del carrito
function calcularTotal() {
    var total = 0;
    carrito.forEach(function (producto) {
        total += producto.cantidad * producto.precio;
    });
    return total;
}
// Función para enviar el pedido por WhatsApp
function enviarPedido() {
    if (medioPago === "") {
        alert("Por favor seleccione el medio de pago antes de enviar el pedido.");
        return;
    }

    if (direccion === "") {
        alert("Por favor ingrese una direccion antes de enviar el pedido.");
        return
    }

    var mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n";
    carrito.forEach(function (producto) {
        mensaje += producto.cantidad + "x " + producto.nombre + "\n";
    });
    mensaje += "Dirección: " + direccion + "\n";
    mensaje += "Medio de Pago: " + medioPago + "\n";

    // Calcular el vuelto para poner en el mensaje
    var total = calcularTotal();

    // Agregar detalles adicionales según el medio de pago
    if (medioPago === "Efectivo") {
        var montoAbonado;
        do{
            montoAbonado = parseFloat(prompt("El total es: " + total + "¿Con cuánto va a abonar?"));
        } while (isNaN(montoAbonado));
        
        while (montoAbonado === ""){
           montoAbonado = prompt("Por favor, ingrese un monto válido:"); 
        }    
        mensaje += "Voy a abonar con: " + montoAbonado + "$\n";
    } else if (medioPago === "Transferencia Bancaria") {
        var nombreydocumento = prompt("Ingrese el nombre completo y documento de quién realizará la transferencia bancaria:");
        while (nombreydocumento === ""){
            nombreydocumento = prompt("Por favor, ingrese un nombre y documento válido:"); 
        } 
        mensaje += "Nombre/Documento de quién transfiere: " + nombreydocumento + "\n";
    } else if (medioPago === "Tarjeta de crédito o débito") {
        mensaje += "Se llevará un posnet para abonar.\n";
    }

    // Mensaje final, listo para enviar.
    var vuelto = montoAbonado - total;
    mensaje += "El Total: " + total + "$\n";
    //Comprueba que haya un vuelto, si no corresponde no lo muestra en el mensaje
    if (isNaN(vuelto) == true){
        vuelto = "";
    } else{
        mensaje += "El vuelto:" + vuelto + "$"
    }

    if (mensaje.includes("null")) {
        // Reemplazar "null" por "[COMPLETAR AQUI]"
        var mensajeModificado = mensaje.replace(/null/g, "[COMPLETAR AQUI]");
        alert("Por favor complete los datos anteriores:\n" + mensajeModificado);
        return;
    }

    // Construir el enlace para WhatsApp
    var enlacePedido = "https://wa.me/" + 1123384618 + "?text=" + encodeURIComponent(mensaje);

    // Asignar el enlace al enlace de pedido
    document.getElementById("pedidoLink").href = enlacePedido;
}
    