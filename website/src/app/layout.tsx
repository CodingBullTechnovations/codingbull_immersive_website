import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jb-mono',
  display: 'swap',
});

/**
 * Root metadata deliberately carries NO canonical. Every route declares its
 * own (see `pageMetadata` / `generateMetadata`). If a future page forgets,
 * it will emit no canonical and Google will self-canonicalize — far safer
 * than silently inheriting the homepage canonical, which would tell Google
 * the new page *is* the homepage and keep it out of the index.
 */
export const metadata: Metadata = (() => {
  const base = generatePageMetadata(pageMetadata.home);
  return { ...base, alternates: undefined, openGraph: { ...base.openGraph, url: undefined } };
})();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head />
      <body
        className="font-[family-name:var(--font-inter)] antialiased bg-[#050505] text-white"
      >
        <AppShell footer={<Footer />}>{children}</AppShell>
      </body>
    </html>
  );
}
