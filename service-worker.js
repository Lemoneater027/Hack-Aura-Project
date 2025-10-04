// FitTrainer Hub - Service Worker for Multi-Page PWA

const CACHE_NAME = 'fittrainer-hub-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/trainers.html',
  '/store.html',
  '/social.html',
  '/dashboard.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Install - cache all pages
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching all pages');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('✅ All pages cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail
        if (event.request.mode === 'navigate') {
          // For navigation requests, try to serve appropriate cached page
          const url = new URL(event.request.url);
          const pathname = url.pathname;
          
          if (pathname.includes('trainers')) {
            return caches.match('/trainers.html');
          } else if (pathname.includes('store')) {
            return caches.match('/store.html');
          } else if (pathname.includes('social')) {
            return caches.match('/social.html');
          } else if (pathname.includes('dashboard')) {
            return caches.match('/dashboard.html');
          } else {
            return caches.match('/index.html');
          }
        }
      })
  );
});

console.log('✅ Multi-page Service Worker loaded');
