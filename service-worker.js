// FitTrainer Hub - Full Multi-Page Service Worker (with per-page CSS auto update)

const CACHE_NAME = 'fittrainer-hub-v4'; // bump only if you change SW logic
const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/app.js'
];

// Install - cache core files
self.addEventListener('install', (event) => {
  console.log('🔧 Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate - clear old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Activating new Service Worker...');
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🗑️ Removing old cache:', name);
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch - smart handling for HTML, CSS, JS, images
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 🔹 HTML files → network first (for latest structure)
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // 🔹 CSS & JS files → network first (for instant updates)
  if (req.destination === 'style' || req.destination === 'script') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 🔹 Images → cache first, fallback to network
  if (req.destination === 'image') {
    event.respondWith(
      caches.match(req)
        .then((cached) => cached || fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }))
    );
    return;
  }

  // Default → network fallback to cache
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

console.log('✅ Multi-CSS Service Worker ready');
