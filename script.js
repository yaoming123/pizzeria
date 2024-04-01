// Array para almacenar los productos en el carrito
var carrito = [];
var direccion = "";
var medioPago = "";
var numeroWhatsApp = "+541144305694"; // Reemplaza esto con tu número real

// Función para agregar un producto al carrito
// function agregarAlCarrito(nombre, precio) {
//     var cantidad = parseInt(prompt("Ingrese la cantidad de " + nombre + ":", "1"));
//     if (!isNaN(cantidad) && cantidad > 0) {
//         carrito.push({ id: carrito.length + 1, nombre: nombre, cantidad: cantidad, precio: precio });
//         actualizarCarrito();
//     } else {
//         alert("La cantidad ingresada no es válida.");
//     }
// }

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
    carritoHTML += "<p>Total: " + total + "$</p>";
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

// Función para solicitar la dirección
// function solicitarDireccion() {
//     direccion = prompt("Ingrese la dirección con entre calles:");
// }
function solicitarDireccion() {
    direccion = prompt("Ingrese la dirección con entre calles:");
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

    var mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n";
    carrito.forEach(function (producto) {
        mensaje += producto.cantidad + "x " + producto.nombre + "\n";
    });
    mensaje += "Dirección: " + direccion + "\n";
    mensaje += "Medio de Pago: " + medioPago + "\n";

    // Agregar detalles adicionales según el medio de pago
    if (medioPago === "Efectivo") {
        var montoAbonado = prompt("¿Con cuánto va a abonar?");
        while (montoAbonado === ""){
           montoAbonado = prompt("Por favor, ingrese un monto válido:"); 
        }    
        mensaje += "Monto abonado: " + montoAbonado + "$\n";
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
    mensaje += "Total: " + calcularTotal() + "$";

    // // Verificar si la cadena "null" aparece en el mensaje
    // if (mensaje.includes("null")) {
    //     alert("Por favor complete los datos anteriores");
    //     return;
    // }
    if (mensaje.includes("null")) {
        // Reemplazar "null" por "[COMPLETAR AQUI]"
        var mensajeModificado = mensaje.replace(/null/g, "[COMPLETAR AQUI]");
        alert("Por favor complete los datos anteriores:\n" + mensajeModificado);
        return;
    }

    // Construir el enlace para WhatsApp
    var enlacePedido = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensaje);

    // Asignar el enlace al enlace de pedido
    document.getElementById("pedidoLink").href = enlacePedido;
}

// // Función para enviar el pedido por WhatsApp
// function enviarPedido() {
//     if (medioPago === "") {
//         alert("Por favor seleccione el medio de pago antes de enviar el pedido.");
//         return;
//     }

//     var mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n";
//     carrito.forEach(function (producto) {
//         mensaje += producto.cantidad + "x " + producto.nombre + "\n";
//     });
//     mensaje += "Dirección: " + direccion + "\n";
//     mensaje += "Medio de Pago: " + medioPago + "\n";

//     // Agregar detalles adicionales según el medio de pago
//     if (medioPago === "Efectivo") {
//         var montoAbonado = prompt("¿Con cuánto va a abonar?");
//         while (montoAbonado === ""){
//            montoAbonado = prompt("Por favor, ingrese un monto válido:"); 
//         }    
//         mensaje += "Monto abonado: " + montoAbonado + "$\n";
//     } else if (medioPago === "Transferencia Bancaria") {
//         var nombreydocumento = prompt("Ingrese el nombre completo y documento de quién realizará la transferencia bancaria:");
//         while (nombreydocumento === ""){
//             nombreydocumento = prompt("Por favor, ingrese un nombre y documento válido:"); 
//         } 
//         mensaje += "Nombre/Documento de quién transfiere: " + nombreydocumento + "\n";
//     } else if (medioPago === "Tarjeta de crédito o débito") {
//         mensaje += "Se llevará un posnet para abonar.\n";
//     }

//     // Mensaje final, listo para enviar.
//     mensaje += "Total: " + calcularTotal() + "$";

//     // ver si la cadena null aparece en la variable mensaje si en el mensaje no aparece null continuar, si contiene null ejecutar enviarPedido() nuevamente
//     if (mensaje.includes("null")){
//         enviarPedido;
//     }

//     // Construir el enlace para WhatsApp
//     var enlacePedido = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensaje);

//     // Asignar el enlace al enlace de pedido
//     document.getElementById("pedidoLink").href = enlacePedido;
// }





















// // Array para almacenar los productos en el carrito
// var carrito = [];
// var direccion = "";
// var medioPago = "";
// var numeroWhatsApp = "+541144305694"; // Reemplaza esto con tu número real

// // Función para agregar un producto al carrito
// function agregarAlCarrito(nombre, precio) {
//     var cantidad = parseInt(prompt("Ingrese la cantidad de " + nombre + ":", "1"));
//     if (!isNaN(cantidad) && cantidad > 0) {
//         carrito.push({ id: carrito.length + 1, nombre: nombre, cantidad: cantidad, precio: precio });
//         actualizarCarrito();
//     } else {
//         alert("La cantidad ingresada no es válida.");
//     }
// }

// // Función para eliminar un producto del carrito
// function eliminarDelCarrito(id) {
//     carrito = carrito.filter(function (producto) {
//         return producto.id !== id;
//     });
//     actualizarCarrito();
// }

// // Función para actualizar la visualización del carrito
// function actualizarCarrito() {
//     var carritoHTML = "<ul>";
//     var total = 0;
//     carrito.forEach(function (producto) {
//         var subtotal = producto.cantidad * producto.precio;
//         carritoHTML += "<li>" + producto.cantidad + "x " + producto.nombre + " - Precio unitario: " + producto.precio + "$ - Subtotal: " + subtotal + "$" +
//             "<div> <button class='button button1' onclick=\"editarProducto(" + producto.id + ")\">Editar</button>" +
//             "<button class='button button1' onclick=\"eliminarDelCarrito(" + producto.id + ")\">Eliminar</button></div></li>";
//         total += subtotal;
//     });
//     carritoHTML += "</ul>";
//     carritoHTML += "<p>Total: " + total + "$</p>";
//     document.getElementById("carrito").innerHTML = carritoHTML;
// }

// // Función para editar la cantidad de un producto en el carrito
// function editarProducto(id) {
//     var nuevoCantidad = parseInt(prompt("Ingrese la nueva cantidad:"));
//     if (!isNaN(nuevoCantidad) && nuevoCantidad > 0) {
//         var producto = carrito.find(function (p) {
//             return p.id === id;
//         });
//         producto.cantidad = nuevoCantidad;
//         actualizarCarrito();
//     } else {
//         alert("La cantidad ingresada no es válida.");
//     }
// }

// // Función para solicitar la dirección
// function solicitarDireccion() {
//     direccion = prompt("Ingrese la dirección con entre calles:");
// }

// // Función para seleccionar el medio de pago
// function seleccionarMedioPago() {
//     var selectMedioPago = document.getElementById("medioPago");
//     medioPago = selectMedioPago.value;
// }

// // Función para calcular el total del carrito
// function calcularTotal() {
//     var total = 0;
//     carrito.forEach(function (producto) {
//         total += producto.cantidad * producto.precio;
//     });
//     return total;
// }

// // Función para enviar el pedido por WhatsApp
// function enviarPedido() {
//     if (direccion === "") {
//         alert("Por favor ingrese la dirección antes de enviar el pedido.");
//         solicitarDireccion();
//         return;
//     }

//     if (medioPago === "") {
//         alert("Por favor seleccione el medio de pago antes de enviar el pedido.");
//         return;
//     }

//     var mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n";
//     carrito.forEach(function (producto) {
//         mensaje += producto.cantidad + "x " + producto.nombre + "\n";
//     });
//     mensaje += "Dirección: " + direccion + "\n";
//     mensaje += "Medio de Pago: " + medioPago + "\n";

//     // Agregar detalles adicionales según el medio de pago
//     if (medioPago === "Efectivo") {
//         var montoAbonado = prompt("¿Con cuánto va a abonar?");
//         mensaje += "Monto abonado: " + montoAbonado + "$\n";
//     } else if (medioPago === "Transferencia Bancaria") {
//         var aliasCBU = prompt("Ingrese el Nombre completo y documento de quien realizara la transferencia bancaria:");
//         mensaje += "Alias/CBU: " + aliasCBU + "\n";
//     } else if (medioPago === "Link de pago") {
//         var linkPago = prompt("Ingrese el link de pago generado:");
//         mensaje += "Link de pago: " + linkPago + "\n";
//     } else if (medioPago === "Tarjeta de crédito o débito") {
//         mensaje += "Se llevará un posnet para abonar.\n";
//     }

//     mensaje += "Total: " + calcularTotal() + "$";

//     // Construir el enlace para WhatsApp
//     var enlacePedido = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensaje);

//     // Asignar el enlace al enlace de pedido
//     document.getElementById("pedidoLink").href = enlacePedido;
// }