document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id'); // Ejemplo: detail.html?id=1

    // Cargar el archivo JSON de productos
    fetch('../productos.json')  // Cambia esta ruta al archivo correcto
      .then(response => response.json())
      .then(data => {
        // Encontrar el producto correspondiente
        const producto = data.productos.find(p => p.id == productoId);

        if (producto) {
          // Actualizar los breadcrumbs
          document.querySelector('.breadcrumbs #producto-nombre').textContent = producto.nombre;

          // Actualizar la información del producto
          document.querySelector('#nombre-producto').textContent = producto.nombre;
          document.querySelector('#producto-imagen').src = producto.imagen;
          document.querySelector('#producto-imagen').alt = producto.nombre;
          document.querySelector('#descripcion-producto').textContent = producto.descripcion;
          document.querySelector('#precio').textContent = `$${producto.precio.toLocaleString()}`;

          // Otros detalles como precio original, descuentos, etc.
        } else {
          // Si el producto no se encuentra, mostrar un mensaje
          alert('Producto no encontrado.');
        }
      })
      .catch(error => console.error('Error cargando los productos:', error));
  });
