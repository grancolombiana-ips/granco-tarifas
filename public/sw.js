// Service Worker - Grancolombiana IPS PWA
// Estrategia "network-first" real: siempre pide la versión más reciente
// directamente al servidor (ignorando la caché HTTP del navegador),
// y solo usa la caché local si no hay conexión a internet.
//
// IMPORTANTE: cada vez que publiques cambios en el sitio, sube este archivo
// también y sube en 1 el número de CACHE_VERSION de abajo. Eso obliga a
// todos los navegadores a limpiar su copia vieja de inmediato.
const CACHE_VERSION = 2; // <-- sube este número en cada despliegue importante
const CACHE = 'granco-tarifas-v' + CACHE_VERSION;
const APP_SHELL = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Avisa a todas las pestañas abiertas que hay una versión nueva activa,
        // para que se refresquen solas y el paciente vea el cambio de inmediato.
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // 'no-store' obliga al navegador a ir siempre al servidor real,
    // ignorando su propia caché HTTP (esto es lo que faltaba antes).
    fetch(event.request, { cache: 'no-store' })
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match('/'))
      )
  );
});
