'use client';

import { env } from '@/lib/env';
import { getIndustryForPath, getTrafficChannel, normalizePath } from '@/lib/industry';

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
  if (typeof window !== 'undefined' && shouldIgnorePath(window.location.pathname)) return;

  const page = typeof window !== 'undefined' ? normalizePath(window.location.pathname) : String(params?.page ?? '/');
  const attribution = typeof window !== 'undefined' ? getAttribution(page) : {};
  const payload = {
    name,
    page,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    ...attribution,
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

export function trackPageView(page: string) {
  const normalizedPage = normalizePath(page);
  if (shouldIgnorePath(normalizedPage) || isDuplicatePageView(normalizedPage)) return;

  trackEvent('page_view', {
    page: normalizedPage,
    title: typeof document !== 'undefined' ? document.title : '',
  });
}

function getSessionId() {
  if (typeof window === 'undefined') return undefined;

  const key = 'cb_session_id';
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;

  const id = makeId();
  window.sessionStorage.setItem(key, id);
  return id;
}

function getVisitorId() {
  if (typeof window === 'undefined') return undefined;

  const key = 'cb_visitor_id';
  const legacySessionId = window.localStorage.getItem('cb_session_id');
  const existing = window.localStorage.getItem(key) ?? legacySessionId;
  if (existing) {
    window.localStorage.setItem(key, existing);
    return existing;
  }

  const id = makeId();
  window.localStorage.setItem(key, id);
  return id;
}

function getAttribution(page: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const landingPage = window.sessionStorage.getItem('cb_landing_page') ?? page;
  window.sessionStorage.setItem('cb_landing_page', landingPage);

  const utmSource = searchParams.get('utm_source') ?? undefined;
  const utmMedium = searchParams.get('utm_medium') ?? undefined;
  const utmCampaign = searchParams.get('utm_campaign') ?? undefined;
  const trafficChannel = getTrafficChannel(document.referrer, utmMedium, utmSource);

  return {
    landingPage,
    industry: getIndustryForPath(page),
    trafficChannel,
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

function isDuplicatePageView(page: string) {
  if (typeof window === 'undefined') return true;

  const key = 'cb_last_page_view';
  const now = Date.now();
  const raw = window.sessionStorage.getItem(key);
  let last: { page?: string; at?: number } | null = null;

  try {
    last = raw ? JSON.parse(raw) as { page?: string; at?: number } : null;
  } catch {
    last = null;
  }

  if (last?.page === page && last.at && now - last.at < 30 * 60 * 1000) {
    return true;
  }

  window.sessionStorage.setItem(key, JSON.stringify({ page, at: now }));
  return false;
}

function shouldIgnorePath(path: string) {
  return path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next');
}

function makeId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

// --- Type augmentation for gtag ---
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
