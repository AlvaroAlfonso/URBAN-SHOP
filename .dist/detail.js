document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Llamar a la función para cargar el archivo JSON
    fetch('../products.json')
        .then(response => response.json())
        .then(data => {
            const producto = getProductoById(data.productos, productId);
            
            if (producto) {
                // Cargar los datos del producto en la página
                document.getElementById('nombre-producto').textContent = producto.nombre;
                document.getElementById('precio-producto').textContent = `$${producto.precio.toLocaleString()}`;
                document.getElementById('imagen-producto').src = producto.imagen;
                document.getElementById('descripcion-producto').textContent = producto.descripcion;

                // Cargar detalles adicionales
                document.getElementById('actividad').textContent = producto.actividad;
                document.getElementById('material').textContent = producto.material;
                document.getElementById('color').textContent = producto.color;
                document.getElementById('origen').textContent = producto.origen;

                // Actualizar los breadcrumbs con el nombre del producto
                actualizarBreadcrumbs(producto.nombre);

                // Botón de "Compra rápida"
                document.getElementById('btn-mercadopago').addEventListener('click', function () {
                    iniciarPagoMercadoPago(producto);
                });

                // Agregar al carrito
                document.getElementById('btn-agregar-carrito').addEventListener('click', function () {
                    agregarAlCarrito(producto);
                });

            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
        });
});

// Función para obtener un producto por ID
function getProductoById(productos, id) {
    return productos.find(producto => producto.id == id);
}

// Función para actualizar los breadcrumbs con el nombre del producto
function actualizarBreadcrumbs(nombreProducto) {
    // Asumiendo que tenemos una estructura de breadcrumbs en el HTML
    const breadcrumbsContainer = document.querySelector('.breadcrumbs .container');

    // Actualizar los breadcrumbs con el nombre del producto
    const breadcrumbsHTML = `
        <a href="/index.html">Inicio</a> &gt;
        <a href="/pages/tienda.html">Última Moda</a> &gt;
        <span>${nombreProducto}</span>
    `;

    breadcrumbsContainer.innerHTML = breadcrumbsHTML; // Reemplazar el contenido de los breadcrumbs
}

// Función para iniciar el pago con Mercado Pago
function iniciarPagoMercadoPago(producto) {
    const mp = new MercadoPago('APP_USR-883f38a4-6aad-42f3-a7a4-5c90260ba6d1', {
        locale: 'es-CO'
    });

    const preference = {
        items: [{
            title: producto.nombre,
            unit_price: producto.precio,
            quantity: 1,
            currency_id: 'COP',
            description: producto.descripcion
        }],
        back_urls: {
            success: window.location.href + "?status=success",
            failure: window.location.href + "?status=failure",
            pending: window.location.href + "?status=pending"
        },
        auto_return: 'approved',
        external_reference: `URBANSHOP_${Date.now()}`
    };

    fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer APP_USR-1658048500769225-032621-6755be234ff86cce227e0fbcfa94f0ad-2354467744'
        },
        body: JSON.stringify(preference)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            mp.checkout({
                preference: {
                    id: data.id
                },
                autoOpen: true
            });
        } else {
            console.error("Error creando la preferencia de pago");
        }
    })
    .catch(error => {
        console.error('Error en el proceso de pago:', error);
    });
}
