// Array para almacenar los productos en el carrito
var carrito = [];
var direccion = "";
var medioPago = "";
var numeroWhatsApp = "123456"; 

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

// Función para copiar el texto al portapapeles con reintento
function copiarAlPortapapeles(mensaje, intentos = 3) {
    navigator.clipboard.writeText(mensaje).then(function() {
        alert('Si el link de WhatsApp no carga el pedido en la App. El pedido ha sido copiado al portapapeles, solo péguelo');
    }).catch(function(err) {
        if (intentos > 0) {
            console.log('Error al copiar el pedido: ', err, '. Intentando nuevamente...');
            copiarAlPortapapeles(mensaje, intentos - 1);
        } else {
            alert('Error al copiar el pedido después de varios intentos: ', err);
        }
    });
}

// Función para generar el pedido y copiarlo al portapapeles
function generarPedido() {
    var pedido = "Detalles del pedido:\\n";
    carrito.forEach(function(producto) {
        pedido += producto.nombre + " - Cantidad: " + producto.cantidad + " - Precio: $" + producto.precio + "\\n";
    });
    pedido += "Dirección: " + direccion + "\\n";
    pedido += "Medio de pago: " + medioPago + "\\n";
    copiarAlPortapapeles(pedido);  // Intentar copiar el pedido al portapapeles
}
