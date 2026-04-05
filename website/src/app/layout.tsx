import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, generateOrganizationSchema } from '@/lib/schema';
import { env } from '@/lib/env';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileWhatsAppCTA } from '@/components/layout/MobileWhatsAppCTA';
import SmoothScrolling from '@/components/animations/SmoothScrolling';
import { Preloader } from '@/components/animations/Preloader';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { CookieConsent } from '@/components/layout/CookieConsent';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = generatePageMetadata(pageMetadata.home);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <JsonLd data={generateOrganizationSchema()} />
      </head>
      <body
        className="font-[family-name:var(--font-inter)] antialiased bg-[#050505] text-white"
      >
        <AnalyticsProvider>
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
      </body>
    </html>
  );
}
