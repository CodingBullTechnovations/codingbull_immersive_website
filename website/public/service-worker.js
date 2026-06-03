self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(clearLegacyCaches());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearLegacyCaches()
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        for (const client of clients) {
          client.navigate(client.url);
        }
      }),
  );
});

self.addEventListener('fetch', () => {
  return;
});

async function clearLegacyCaches() {
  if (!self.caches) return;
  const cacheNames = await self.caches.keys();
  await Promise.all(cacheNames.map((cacheName) => self.caches.delete(cacheName)));
}
