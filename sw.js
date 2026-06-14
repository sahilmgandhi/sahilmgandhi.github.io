importScripts('https://storage.googleapis.com/workbox-cdn/7.1.0/workbox-sw.js');

const { Routing, Strategies, Expiration, CacheableResponse } = workbox;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = Strategies;
const { ExpirationPlugin } = Expiration;
const { CacheableResponsePlugin } = CacheableResponse;

const OFFLINE_FALLBACK = '/offline.html';
const CACHE_VERSION = 'v1';

// Skip waiting and claim clients immediately
self.skipWaiting();
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// HTML pages — NetworkFirst (fresh content, offline fallback)
Routing.registerRoute(
  ({ request }) => request.destination === 'html',
  new NetworkFirst({
    cacheName: `pages-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  })
);

// CSS & JS — StaleWhileRevalidate (serve cache fast, update in background)
Routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: `static-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Images — CacheFirst (long-term)
Routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: `images-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 90 * 24 * 60 * 60 }),
    ],
  })
);

// Fonts (local + Google Fonts) — CacheFirst (long-term)
Routing.registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: `fonts-${CACHE_VERSION}`,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 180 * 24 * 60 * 60 }),
    ],
  })
);

// Fallback to offline page for navigation requests when network fails
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_FALLBACK);
      })
    );
  }
});
