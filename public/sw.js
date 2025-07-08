// Define the name of your cache
const CACHE_NAME = 'quran-app-cache-v1';

// List of URLs to cache (your app's core files)
// These are relative paths, so they should match your project structure
const urlsToCache = [
  '/', // The root path of your application
  '/index.html',
  '/manifest.json',
  '/vite.svg', // Your existing favicon
  '/icons/icon-192x192.png', // The icons we just added
  '/icons/icon-512x512.png',
  '/src/main.jsx', // Your main application entry
  '/src/App.jsx', // Your main App component
  '/src/index.css', // Your CSS files
  '/src/App.css'
  // You might need to add more files here later if your app uses them directly
  // like specific audio files if they are static assets
];

// 1. Install Event: Caches the listed assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activates the service worker immediately
  );
});

// 2. Activate Event: Cleans up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Takes control of current pages
  );
});

// 3. Fetch Event: Intercepts network requests and serves from cache or network
self.addEventListener('fetch', event => {
  // Only handle GET requests and navigate/sub_resource requests
  if (event.request.method === 'GET' && (event.request.mode === 'navigate' || event.request.destination === 'image' || event.request.destination === 'script' || event.request.destination === 'style')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return response;
          }

          // No cache hit - fetch from network
          console.log('[Service Worker] Fetching from network:', event.request.url);
          return fetch(event.request)
            .then(networkResponse => {
              // Check if we received a valid response
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and can only be consumed once. We must clone it so that
              // we can consume the stream twice.
              const responseToCache = networkResponse.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            })
            .catch(error => {
              console.error('[Service Worker] Fetch failed:', event.request.url, error);
              // You could return an offline page here if needed
              // For now, just re-throw the error or return a generic fallback
              throw error; // Re-throw to indicate failure
            });
        })
    );
  }
});
