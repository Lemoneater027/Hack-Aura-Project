// FitTrainer Hub - Hackathon-safe auto-updating Service Worker

const CACHE_NAME = 'fittrainer-hub-v5'; // keep versioned for clarity
const CORE_ASSETS = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/js/app.js'
];

// Install - pre-cache only essentials
self.addEventListener('install', (event) => {
  console.log('🔧 Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// Activate - delete old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Activating service worker...');
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    ).then(() => self.clients.claim()) // take control immediately
  );
});

// Fetch - always try the network first
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Cache a fresh copy
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req)) // fallback offline
  );
});

console.log('✅ Service worker loaded (auto-updating + judge-safe)');
