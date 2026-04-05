'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { env } from '@/lib/env';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);

  useEffect(() => {
    // Check initial consent
    const savedConsent = localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
    setConsent(savedConsent);

    // Listen for updates from CookieConsent component
    const handleConsentUpdate = () => {
      const updatedConsent = localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
      setConsent(updatedConsent);
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
  }, []);

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
