'use client';

import { env } from '@/lib/env';

// =============================================================================
// GA4 Analytics
// =============================================================================

/** Initialize GA4 (call once in layout) */
export function initAnalytics() {
  if (!env.isProduction || !env.gaId) return;

  // gtag is loaded via Script component in layout
  window.gtag?.('config', env.gaId, {
    page_path: window.location.pathname,
  });
}

/** Track a custom event */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (!env.isProduction || !env.gaId) {
    // eslint-disable-next-line no-console
    console.debug('[Analytics]', name, params);
    return;
  }

  window.gtag?.('event', name, params);
}

// --- Type augmentation for gtag ---
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
