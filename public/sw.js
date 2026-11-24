// Changer le nom à chaque modification de ce fichier : l'ancien cache est supprimé à l'activation
const CACHE_NAME = 'paninibase-v2';

// Assets à mettre en cache au premier chargement (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/logo-192.png',
  '/logo-512.png',
  '/manifest.json',
];

// ── Installation : met en cache les assets statiques ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activation : supprime les anciens caches ──────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

const putInCache = (request, response) => {
  if (response.ok && response.type === 'basic') {
    const clone = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return response;
};

// ── Fetch ──────────────────────────────────────────────────────────────────
//  - Supabase, Sentry, requêtes non-GET : jamais interceptées
//  - Pages (index.html) : réseau d'abord, sinon la dernière version en cache.
//    En cache d'abord, une mise en ligne ne serait jamais vue (l'ancienne page
//    pointerait vers les anciens fichiers JS).
//  - Fichiers JS/CSS/images : cache d'abord (leur nom change à chaque version)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('sentry.io') ||
    event.request.method !== 'GET'
  ) {
    return; // laisse passer sans interception
  }

  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => putInCache(event.request, response))
        .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => putInCache(event.request, response))
        .catch(() => new Response('Hors ligne', { status: 503 }));
    })
  );
});
