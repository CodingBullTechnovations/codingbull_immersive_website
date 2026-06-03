'use client';

import { useEffect } from 'react';

export function ServiceWorkerCleanup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;

    async function clearLegacyServiceWorkers() {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        }

        if (!cancelled && navigator.serviceWorker.controller) {
          window.location.reload();
        }
      } catch {
        // Legacy service worker cleanup is best-effort only.
      }
    }

    void clearLegacyServiceWorkers();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
