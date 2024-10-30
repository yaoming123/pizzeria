
// Array para almacenar los productos en el carrito
var carrito = [];
var direccion = "";
var medioPago = "";
var numeroWhatsApp = "5491122413762"; // 

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    
    var cantidad = parseInt(prompt("Ingrese la cantidad de " + nombre + ":", "1"));

    // Verificar que la cantidad ingresada sea válida
    if (!isNaN(cantidad) && cantidad > 0) {
        // Buscar si el producto ya existe en el carrito
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
        

        // Selecciona el botón flotante del carrito
        const botonCarrito = document.querySelector('.button-flotante');
        
        // Añade la clase que hace que titile
        botonCarrito.classList.add('titilar');
        
        // Mantener el titileo por un tiempo (ej: 6 segundos) y luego detenerlo
        setTimeout(() => {
            botonCarrito.classList.remove('titilar');
        }, 6000); // tiempo que desees en milisegundos (6 segundos)


        // Actualizar la visualización del carrito
        actualizarCarrito();

        // Enviar la información al Data Layer para Google Tag Manager
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "add_to_cart",
            producto: nombre,
            precio: precio,
            cantidad: cantidad
        });
        
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

    // Enviar la información al Data Layer para Google Tag Manager. Eliminar un producto en el carrito
    dataLayer.push({
        event: "remove_from_cart",
    });

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

        // Enviar la información al Data Layer para Google Tag Manager. Editar un producto en el carrito
        dataLayer.push({
            event: "edit_cart",
            // producto: nombreProducto,
            producto: producto.nombre,
            nuevaCantidad: nuevoCantidad
        });

    } else {
        alert("La cantidad ingresada no es válida.");
    }
}

function solicitarDireccion() {
    // NOTA: Quiero anonimizar esto ya que los links tendrian informacion confidencial.
    // direccion = [COMPLETAR EN WHATSAPP SU DIRECCION]
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
        alert("Por favor ingrese una dirección antes de enviar el pedido.");
        return;
    }

    var mensaje = "*¡Hola! Quiero hacer el siguiente pedido:*\n\n";

    carrito.forEach(function (producto) {
        mensaje += `- ${producto.cantidad}x ${producto.nombre}.... ${producto.precio} (c/u) .... Subtotal:${producto.cantidad * producto.precio} \n`;
    });

    mensaje += `\n*Dirección de entrega:* ${direccion}\n`;
    mensaje += `*Medio de Pago:* ${medioPago}\n`;

    var total = calcularTotal();

    if (medioPago === "Efectivo") {
        var montoAbonado;
        do {
            montoAbonado = parseFloat(prompt("El total es: " + total + "¿Con cuánto va a abonar?"));
        } while (isNaN(montoAbonado));

        mensaje += `\n*El Total:* ${total}$\n`;

        mensaje += `*Voy a abonar con:* ${montoAbonado}$\n\n`;
        var vuelto = montoAbonado - total;
        if (!isNaN(vuelto) && vuelto > 0) {
            mensaje += `*El vuelto:* ${vuelto}$\n\n`;
            mensaje += `*Gracias, espero la confirmación de la preparación del pedido.*\n`;

        }
    } else if (medioPago === "Transferencia Bancaria") {
        var nombreydocumento = prompt("Ingrese el nombre completo y documento de quién realizará la transferencia bancaria:");
        mensaje += `*Nombre/Documento de quién transfiere:* ${nombreydocumento}\n`;
    } else if (medioPago === "Tarjeta de crédito o débito") {
        mensaje += "*Se llevará un posnet para abonar.*\n";
    }

    if (mensaje.includes("null")) {
        var mensajeModificado = mensaje.replace(/null/g, "[COMPLETAR AQUI]");
        alert("Por favor complete los datos anteriores:\n" + mensajeModificado);
        return;
    }

    navigator.clipboard.writeText(mensaje).then(function() {
        alert('Se copiará el pedido al portapapeles. Puede pegar el pedido si no se carga en WhatsApp.');
    });

    var enlacePedido = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensaje);

    // Enviar la información al Data Layer para Google Tag Manager. Se genera el pedido con la informacion relevante para el negocio.
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: "pedido_generado",
        pedido: {
            mensaje: mensaje,
            total: total,
            medioPago: medioPago
        }
    });

    document.getElementById("pedidoLink").href = enlacePedido;
}

    
