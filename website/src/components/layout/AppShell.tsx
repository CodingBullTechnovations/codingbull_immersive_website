'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { PersistentWhatsAppCTA } from '@/components/layout/PersistentWhatsAppCTA';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { ServiceWorkerCleanup } from '@/components/providers/ServiceWorkerCleanup';

const CookieConsent = dynamic(
  () => import('@/components/layout/CookieConsent').then((mod) => mod.CookieConsent),
  { ssr: false }
);

export function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-[var(--surface-base)] text-white">{children}</div>;
  }

  return (
    <AnalyticsProvider>
      <div className="public-site">
        <ServiceWorkerCleanup />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-sm bg-primary px-4 py-3 text-sm font-bold text-black shadow-glow transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="overflow-clip">{children}</main>
        {footer}
        <PersistentWhatsAppCTA />
        <CookieConsent />
      </div>
    </AnalyticsProvider>
  );
}
