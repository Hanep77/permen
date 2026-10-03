/* Minimal service worker for installability (installable-only scope: no offline caching). */

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    // Network passthrough. No caching by design in installable-only mode.
    event.respondWith(fetch(request));
});
