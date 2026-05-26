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
  const payload = {
    name,
    page: typeof window !== 'undefined' ? window.location.pathname : params?.page,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    sessionId: getSessionId(),
    params,
  };

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/events', JSON.stringify(payload));
  } else if (typeof fetch !== 'undefined') {
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }

  if (!env.isProduction || !env.gaId) {
     
    console.debug('[Analytics]', name, params);
    return;
  }

  window.gtag?.('event', name, params);
}

function getSessionId() {
  if (typeof window === 'undefined') return undefined;

  const key = 'cb_session_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(key, id);
  return id;
}

// --- Type augmentation for gtag ---
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
