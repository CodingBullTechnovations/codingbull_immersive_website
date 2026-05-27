import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { JsonLd, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = generatePageMetadata(pageMetadata.home);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <JsonLd data={generateOrganizationSchema()} />
        <JsonLd data={generateWebSiteSchema()} />
      </head>
      <body
        className="font-[family-name:var(--font-inter)] antialiased bg-[#050505] text-white"
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
