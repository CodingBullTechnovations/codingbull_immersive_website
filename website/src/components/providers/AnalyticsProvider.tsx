'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { env } from '@/lib/env';
import { trackPageView } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
  });

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

  // Only load GA if consent is explicitly 'accepted'
  const shouldLoadAnalytics = consent === 'accepted' && env.gaId;

  return (
    <>
      {shouldLoadAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.gaId}');
            `}
          </Script>
        </>
      )}
      {children}
    </>
  );
}
