```javascript
const CACHE_NAME = 'chants-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './database.js',  // <--- Une seule ligne suffit pour tous les chants !
  './manifest.json'
];

// Installation : on met en cache les fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Récupération : on sert les fichiers du cache si on est hors ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});