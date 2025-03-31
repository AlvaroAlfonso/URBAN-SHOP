document.addEventListener('DOMContentLoaded', function() {
    const inputBusqueda = document.getElementById('input-busqueda');
    const botonBuscar = document.getElementById('boton-buscar');
    const contenedorSugerencias = document.getElementById('sugerencias-busqueda');
    let productosData = [];

    // Cargar los datos del JSON
    fetch('../products.json')
        .then(response => response.json())
        .then(data => {
            productosData = data.productos;
            console.log('Productos cargados:', productosData.length);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });

    // Función para mostrar sugerencias (sin imágenes)
    function mostrarSugerencias(texto) {
        if (!productosData.length) return;
        
        const textoBusqueda = texto.toLowerCase().trim();
        if (textoBusqueda.length === 0) {
            contenedorSugerencias.style.display = 'none';
            return;
        }

        // Filtrar productos que coincidan con el texto
        const sugerencias = productosData.filter(producto => 
            producto.nombre.toLowerCase().includes(textoBusqueda) || 
            producto.categoria.toLowerCase().includes(textoBusqueda)
        ).slice(0, 5); // Limitar a 5 sugerencias

        if (sugerencias.length > 0) {
            contenedorSugerencias.innerHTML = '';
            
            sugerencias.forEach(producto => {
                const item = document.createElement('div');
                item.className = 'sugerencia-item';
                
                // Nombre y categoría
                const info = document.createElement('div');
                info.style.display = 'flex';
                info.style.alignItems = 'center';
                info.style.flex = '1';
                info.style.minWidth = '0';
                
                const nombre = document.createElement('div');
                nombre.className = 'sugerencia-nombre';
                nombre.textContent = producto.nombre;
                
                const categoria = document.createElement('div');
                categoria.className = 'sugerencia-categoria';
                categoria.textContent = `(${producto.categoria})`;
                
                info.appendChild(nombre);
                info.appendChild(categoria);
                item.appendChild(info);
                
                // Precio
                const precio = document.createElement('div');
                precio.className = 'sugerencia-precio';
                precio.textContent = `$${producto.precio.toLocaleString()}`;
                item.appendChild(precio);
                
                // Evento click
                item.addEventListener('click', function() {
                    inputBusqueda.value = producto.nombre;
                    filtrarProductos(producto.nombre);
                    contenedorSugerencias.style.display = 'none';
                });
                
                contenedorSugerencias.appendChild(item);
            });
            
            contenedorSugerencias.style.display = 'block';
        } else {
            contenedorSugerencias.style.display = 'none';
        }
    }

    // En tu función filtrarProductos, modifica el inicio:
function filtrarProductos(texto) {
    const textoBusqueda = texto.toLowerCase().trim();
    
    // Activar/desactivar modo búsqueda
    document.body.classList.toggle('modo-busqueda', textoBusqueda !== '');
    
    // Resto de tu función existente...
    const productos = document.querySelectorAll('.producto');
    let algunProductoMostrado = false;
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const categoria = producto.querySelector('.categoria').textContent.toLowerCase();
        
        if (textoBusqueda === '' || nombre.includes(textoBusqueda) || categoria.includes(textoBusqueda)) {
            producto.style.display = 'block';
            algunProductoMostrado = true;
        } else {
            producto.style.display = 'none';
        }
    });
        
        
        // Mostrar mensaje si no hay resultados
        const mensajeNoResultados = document.getElementById('mensaje-no-resultados');
        if (!algunProductoMostrado) {
            if (!mensajeNoResultados) {
                const seccionProductos = document.querySelector('.seccion-productos');
                const mensaje = document.createElement('p');
                mensaje.id = 'mensaje-no-resultados';
                mensaje.textContent = 'No se encontraron productos que coincidan con tu búsqueda.';
                mensaje.style.textAlign = 'center';
                mensaje.style.color = '#fff';
                mensaje.style.marginTop = '20px';
                seccionProductos.appendChild(mensaje);
            }
        } else if (mensajeNoResultados) {
            mensajeNoResultados.remove();
        }
    }

    // Eventos
    inputBusqueda.addEventListener('input', function() {
        mostrarSugerencias(this.value);
    });

    inputBusqueda.addEventListener('focus', function() {
        if (this.value.trim().length > 0) {
            mostrarSugerencias(this.value);
        }
    });

    botonBuscar.addEventListener('click', function() {
        filtrarProductos(inputBusqueda.value);
        contenedorSugerencias.style.display = 'none';
    });

    inputBusqueda.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filtrarProductos(this.value);
            contenedorSugerencias.style.display = 'none';
        }
    });

    // Ocultar sugerencias al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!contenedorSugerencias.contains(e.target) && 
            e.target !== inputBusqueda && 
            e.target !== botonBuscar) {
            contenedorSugerencias.style.display = 'none';
        }
    });
});