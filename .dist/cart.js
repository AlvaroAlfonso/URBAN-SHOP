// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = 0;

// Configuración de Mercado Pago
const publicKey = 'APP_USR-883f38a4-6aad-42f3-a7a4-5c90260ba6d1';

// Función para inicializar Mercado Pago
function inicializarMercadoPago() {
  if (typeof MercadoPago === 'undefined') {
    console.error('MercadoPago SDK no está cargado');
    return null;
  }
  return new MercadoPago(publicKey, {
    locale: 'es-CO'
  });
}

// Función para manejar el checkout
async function manejarCheckout() {
  console.log('Iniciando checkout...');

  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío');
    return;
  }

  const mp = inicializarMercadoPago();
  if (!mp) {
    mostrarNotificacion('Error al cargar el sistema de pagos');
    return;
  }

  try {
    mostrarNotificacion('Preparando pago...');

    const items = carrito.map(producto => ({
      title: producto.nombre,
      unit_price: Number(producto.precio),
      quantity: Number(producto.cantidad),
      currency_id: 'COP',
      description: producto.descripcion || producto.nombre
    }));

    console.log('Items para pago:', items);

    const preference = {
      items,
      back_urls: {
        success: window.location.href + "?status=success",
        failure: window.location.href + "?status=failure",
        pending: window.location.href + "?status=pending"
      },
      auto_return: 'approved',
      external_reference: `URBANSHOP_${Date.now()}`
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer APP_USR-1658048500769225-032621-6755be234ff86cce227e0fbcfa94f0ad-2354467744'
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (data.id) {
      mp.checkout({
        preference: {
          id: data.id
        },
        autoOpen: true
      });
    } else {
      mostrarNotificacion('Error creando la preferencia de pago');
    }
  } catch (error) {
    console.error('Error en checkout:', error);
    mostrarNotificacion('Error al procesar el pago: ' + error.message);
  }
}

// Funciones del carrito
function mostrarCarrito() {
  document.getElementById("modalCarrito").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
  actualizarCarrito();
}

function cerrarCarrito() {
  document.getElementById("modalCarrito").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}

function cambiarCantidad(boton, cambio) {
  const contenedor = boton.closest('.cantidad-producto');
  const input = contenedor.querySelector('.input-cantidad');
  let valor = parseInt(input.value) + cambio;
  valor = Math.max(1, valor);
  input.value = valor;
}

function agregarAlCarrito(nombre, precio, imagen, elemento, talla = null) {
  const productoElement = elemento ? elemento.closest('.producto') : null;
  const inputCantidad = productoElement ? productoElement.querySelector('.input-cantidad') : null;
  const cantidad = inputCantidad ? parseInt(inputCantidad.value) || 1 : 1;
  
  // Buscar producto en el carrito
  const productoExistente = carrito.find(item => 
    item.nombre === nombre && 
    (!talla || item.talla === talla)
  );

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    const nuevoProducto = {
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      cantidad: cantidad
    };
    
    if (talla) {
      nuevoProducto.talla = talla;
    }
    
    carrito.push(nuevoProducto);
  }

  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`${cantidad} ${nombre}${talla ? ` (Talla: ${talla})` : ''} agregado(s) al carrito`);
}

function actualizarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  carritoItems.innerHTML = "";
  
  if (carrito.length === 0) {
    carritoItems.innerHTML = "<p>Tu carrito está vacío</p>";
  } else {
    carrito.forEach((producto, index) => {
      const productoCarrito = document.createElement("div");
      productoCarrito.className = "item-carrito";
      productoCarrito.innerHTML = `
        <div class="info-producto">
          <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
          <div>
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString()}</p>
            ${producto.talla ? `<p>Talla: ${producto.talla}</p>` : ''}
          </div>
        </div>
        <div class="controles-cantidad">
          <button class="btn-menos" onclick="actualizarCantidadCarrito(${index}, ${producto.cantidad - 1})">-</button>
          <span>${producto.cantidad}</span>
          <button class="btn-mas" onclick="actualizarCantidadCarrito(${index}, ${producto.cantidad + 1})">+</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${index})"><i class="fas fa-trash"></i></button>
        </div>
        <div class="subtotal">$${(producto.precio * producto.cantidad).toLocaleString()}</div>
      `;
      carritoItems.appendChild(productoCarrito);
    });
  }

  total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
  
  document.getElementById("subtotal").textContent = `$${total.toLocaleString()}`;
  document.getElementById("total").textContent = `$${total.toLocaleString()}`;
  document.getElementById("cart-count").textContent = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
}

function actualizarCantidadCarrito(index, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    eliminarProducto(index);
  } else {
    carrito[index].cantidad = nuevaCantidad;
    guardarCarrito();
    actualizarCarrito();
  }
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion';
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 10);
  
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
  
  // Asignar evento al botón de finalizar compra
  const btnFinalizar = document.querySelector('.btn-finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', manejarCheckout);
  }
  
  // Verificar estado de pago en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  
  if (status === 'success') {
    mostrarNotificacion('¡Pago exitoso! Gracias por tu compra');
    // Vaciar carrito después de compra exitosa
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  } else if (status === 'failure') {
    mostrarNotificacion('Hubo un problema con tu pago. Por favor intenta nuevamente');
  }
});