'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileWhatsAppCTA } from '@/components/layout/MobileWhatsAppCTA';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { ServiceWorkerCleanup } from '@/components/providers/ServiceWorkerCleanup';

const SmoothScrolling = dynamic(() => import('@/components/animations/SmoothScrolling'), {
  ssr: false,
});

const CustomCursor = dynamic(
  () => import('@/components/animations/CustomCursor').then((mod) => mod.CustomCursor),
  { ssr: false }
);

const CookieConsent = dynamic(
  () => import('@/components/layout/CookieConsent').then((mod) => mod.CookieConsent),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-[#06070b] text-white">{children}</div>;
  }

  return (
    <AnalyticsProvider>
      <ServiceWorkerCleanup />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-black shadow-glow transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <SmoothScrolling />
      <CustomCursor />
      <MobileWhatsAppCTA />
      <CookieConsent />
    </AnalyticsProvider>
  );
}
