'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileWhatsAppCTA } from '@/components/layout/MobileWhatsAppCTA';
import SmoothScrolling from '@/components/animations/SmoothScrolling';
import { Preloader } from '@/components/animations/Preloader';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { ServiceWorkerCleanup } from '@/components/providers/ServiceWorkerCleanup';
import { CookieConsent } from '@/components/layout/CookieConsent';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-[#06070b] text-white">{children}</div>;
  }

  return (
    <AnalyticsProvider>
      <ServiceWorkerCleanup />
      <Preloader />
      <CustomCursor />
      <Header />
      <SmoothScrolling>
        <main>{children}</main>
      </SmoothScrolling>
      <Footer />
      <MobileWhatsAppCTA />
      <CookieConsent />
    </AnalyticsProvider>
  );
}
