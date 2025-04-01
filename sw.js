const CACHE_NAME = 'cache_store';
const FILES = [
  // Archivos HTML
  "./index.html",
  "./pages/blog.html",
  "./pages/contactanos.html",
  "./pages/detail.html",
  "./pages/landing.html",
  "./pages/nosotros.html",
  "./pages/tienda.html",
  
  // Archivos JSON
  "./products.json",
  "./manifest.json",

  // Archivos CSS
  "./css/blog.css",
  "./css/contactanos.css",
  "./css/detail.css",
  "./css/landing.css",
  "./css/nosotros.css",
  "./css/style.css",
  "./css/tienda.css",

  // Archivos JS
  "./.dist/blog.js",
  "./.dist/breadcrumbs.js",
  "./.dist/cart.js",
  "./.dist/detail.js",
  "./.dist/formcontact.js",
  "./.dist/hamburger.js",
  "./.dist/landing.js",
  "/.dist/accesibility.js",
  "./.dist/search.js",

  // Archivo JS adicional
  "./script.js"
];

/**
 * ¿Qué hace el método self?
 * Verificar que los archivos existen antes de guardarlos en cache.
 * Almacenar en cache solo los archivos que deben ser guardados.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('Verificando archivos antes de cachear');
      
      // Verificar que los archivos existan
      const validFiles = await Promise.all(
        FILES.map(async (file) => {
          try {
            const response = await fetch(file, { method: 'HEAD' });
            if (response.ok) {
              console.log(`Archivo encontrado: ${file}`);
              return file; // Devuelve el archivo si la respuesta es correcta
            } else {
              console.warn(`Archivo no encontrado: ${file} (Status: ${response.status})`);
            }
          } catch (error) {
            console.error(`Error al verificar el archivo: ${file} (Error: ${error.message})`);
          }
          return null; // Si el archivo no es válido o hay error, se retorna null
        })
      ).filter(Boolean); // Filtrar los archivos nulos

      // Agregar archivos válidos al caché
      if (validFiles.length > 0) {
        await cache.addAll(validFiles);
        console.log('Cache registrada con éxito');
      } else {
        console.log('No se encontraron archivos válidos para almacenar en caché');
      }

      self.skipWaiting(); // Permite que el SW se active de inmediato
    })()
  );
});


self.addEventListener('fetch', (event) => {
  console.log(`Interceptando petición: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        });
    })
    .catch((error) => {
      return new Response('No hay conexión y el recurso no está en cache', {
        status: 503,
        statusText: 'Servicio no disponible',
        error_message: error.message
      });
    })
  );
});


/** 
 * Busca y elimina versiones antiguas de caché.
 * Usa self.clients.claim() para que el SW controle inmediatamente todas las
 * pestañas abiertas. 
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME) // Filtra solo las cachés antiguas
          .map(name => caches.delete(name)) // Las elimina
      );
      console.log('🗑️ Cachés antiguas eliminadas');
    })()
  );
});

self.clients.claim();
      