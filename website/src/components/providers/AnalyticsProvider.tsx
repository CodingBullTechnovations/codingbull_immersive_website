'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastGaPageView = useRef<string | null>(null);
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
  });
  const [measurementId, setMeasurementId] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    const handleConsentUpdate = () => {
      const updatedConsent = localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
      setConsent(updatedConsent);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  const isPublicRoute = Boolean(pathname && !shouldIgnorePath(pathname));

  useEffect(() => {
    if (consent !== 'accepted' || !isPublicRoute || configLoaded) return;

    let cancelled = false;

    fetch('/api/analytics/config', {
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.ok ? response.json() : { measurementId: '' })
      .then((config: { measurementId?: string }) => {
        if (cancelled) return;
        setMeasurementId(typeof config.measurementId === 'string' ? config.measurementId : '');
        setConfigLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setConfigLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [configLoaded, consent, isPublicRoute]);

  useEffect(() => {
    if (!gaReady || !measurementId || !pathname || !isPublicRoute) return;

    const pageViewKey = `${measurementId}:${pathname}`;
    if (lastGaPageView.current === pageViewKey) return;
    lastGaPageView.current = pageViewKey;

    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaReady, isPublicRoute, measurementId, pathname]);

  // Only load GA if consent is explicitly accepted.
  const shouldLoadAnalytics = consent === 'accepted' && isPublicRoute && measurementId;

  return (
    <>
      {shouldLoadAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive" onReady={() => setGaReady(true)}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}
      {children}
    </>
  );
}

function shouldIgnorePath(path: string) {
  const normalizedPath = path.split('?')[0] || '/';
  return (
    normalizedPath.startsWith('/admin') ||
    normalizedPath.startsWith('/api') ||
    normalizedPath.startsWith('/_next') ||
    normalizedPath === '/sitemap.xml' ||
    normalizedPath === '/robots.txt' ||
    normalizedPath === '/favicon.ico' ||
    /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|woff|woff2)$/i.test(normalizedPath)
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
