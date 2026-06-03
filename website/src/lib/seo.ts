import type { Metadata } from 'next';
import type { PageMetadata } from '@/types/content';
import { siteConfig } from '@/content/site';

export const defaultOgImage = `${siteConfig.baseUrl}/images/og/codingbull-og.png`;
export const defaultOgImageDimensions = {
  width: 1200,
  height: 630,
} as const;

/**
 * Generate Next.js Metadata from our typed PageMetadata.
 * Centralizes title template, OG defaults, and Twitter card config.
 */
export function generatePageMetadata(page: PageMetadata): Metadata {
  const title = page.title.includes('CodingBull')
    ? page.title
    : `${page.title} | CodingBull Technovations`;

  const ogImage = page.ogImage ?? defaultOgImage;
  const ogWidth = page.ogImageWidth ?? defaultOgImageDimensions.width;
  const ogHeight = page.ogImageHeight ?? defaultOgImageDimensions.height;

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title,
    applicationName: 'CodingBull Technovations',
    description: page.description,
    keywords: page.keywords,
    creator: 'CodingBull Technovations Pvt. Ltd.',
    publisher: siteConfig.companyName,
    category: 'Software Development',
    alternates: {
      canonical: page.canonical,
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
        { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title,
      description: page.description,
      url: page.canonical,
      siteName: siteConfig.companyName,
      images: [
        {
          url: ogImage,
          width: ogWidth,
          height: ogHeight,
          alt: page.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.description,
      images: [ogImage],
    },
    robots: page.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Per-page metadata definitions */
export const pageMetadata: Record<string, PageMetadata> = {
  home: {
    title: 'CodingBull Technovations — Custom Software for Healthcare, E-commerce & HRMS',
    description:
      'CodingBull builds custom digital systems for healthcare clinics, e-commerce operations, and workforce management. Fixed-price projects, founder-led delivery for India, USA, UAE, and Canada.',
    keywords: [
      'custom software development',
      'healthcare software',
      'e-commerce development',
      'HRMS software',
      'Ahmedabad software company',
      'fixed price software',
    ],
    canonical: siteConfig.baseUrl,
  },
  about: {
    title: 'About CodingBull — Founder-Led Custom Software Company',
    description:
      'CodingBull Technovations is a founder-led software company in Ahmedabad building custom healthcare, e-commerce, and HRMS systems for India and USA clients.',
    canonical: `${siteConfig.baseUrl}/about`,
  },
  contact: {
    title: 'Get a Fixed-Price Quote — Contact CodingBull',
    description:
      'Discuss your custom software project with CodingBull. Get a fixed-price quote via WhatsApp or our inquiry form. Healthcare, e-commerce, HRMS specialists.',
    canonical: `${siteConfig.baseUrl}/contact`,
  },
  caseStudies: {
    title: 'Case Studies — Real Systems We\'ve Built | CodingBull',
    description:
      'See real healthcare, e-commerce, and HRMS systems built by CodingBull. Detailed case studies with challenges, solutions, and outcomes.',
    canonical: `${siteConfig.baseUrl}/case-studies`,
  },
  insights: {
    title: 'Insights — Software Development & Business Systems | CodingBull',
    description:
      'Expert insights on healthcare software, e-commerce systems, HRMS, and custom business software development from the CodingBull team.',
    canonical: `${siteConfig.baseUrl}/insights`,
  },
  ahmedabad: {
    title: 'Best Software Development Company in Ahmedabad | CodingBull',
    description:
      'CodingBull Technovations — Ahmedabad-based custom software company specializing in healthcare, e-commerce, and HRMS systems. Fixed-price, founder-led delivery.',
    keywords: ['software company Ahmedabad', 'custom software Ahmedabad', 'web development Ahmedabad'],
    canonical: `${siteConfig.baseUrl}/ahmedabad`,
  },
  india: {
    title: 'CodingBull Technovations Pvt. Ltd. — Custom Software Development Company in India',
    description:
      'CodingBull Technovations Pvt. Ltd. builds healthcare software, e-commerce platforms, HRMS, payroll systems, and custom business software for Indian companies.',
    keywords: ['software development India', 'custom software company India', 'healthcare software India', 'e-commerce development India', 'HRMS software India'],
    canonical: `${siteConfig.baseUrl}/india`,
  },
  usa: {
    title: 'CodingBull Technovations Pvt. Ltd. — Custom Software Development for USA Businesses',
    description:
      'Custom healthcare, e-commerce, HRMS, payroll, internal CRM, and workflow automation software for USA businesses with scoped architecture and founder-led delivery.',
    keywords: ['custom software USA', 'offshore software development', 'healthcare software USA', 'e-commerce development USA', 'custom HRMS USA'],
    canonical: `${siteConfig.baseUrl}/usa`,
  },
  uae: {
    title: 'CodingBull Technovations Pvt. Ltd. — Custom Software Development for UAE Businesses',
    description:
      'Custom healthcare software, e-commerce platforms, HRMS, payroll, internal CRM, and workflow automation for UAE businesses with fixed-scope delivery.',
    keywords: ['custom software UAE', 'software development UAE', 'healthcare software UAE', 'e-commerce development UAE', 'HRMS software UAE'],
    canonical: `${siteConfig.baseUrl}/uae`,
  },
  canada: {
    title: 'CodingBull Technovations Pvt. Ltd. — Custom Software Development for Canadian Businesses',
    description:
      'Custom healthcare, e-commerce, HRMS, payroll, internal CRM, and workflow automation software for Canadian businesses with secure architecture and predictable delivery.',
    keywords: ['custom software Canada', 'software development Canada', 'healthcare software Canada', 'e-commerce development Canada', 'HRMS software Canada'],
    canonical: `${siteConfig.baseUrl}/canada`,
  },
  privacy: {
    title: 'Privacy Policy | CodingBull Technovations',
    description: 'Privacy policy for CodingBull Technovations. How we handle data and protect your identity in our custom software projects.',
    canonical: `${siteConfig.baseUrl}/privacy`,
  },
  terms: {
    title: 'Terms of Engagement | CodingBull Technovations',
    description: 'Terms of engagement for CodingBull Technovations. Standard operational terms for our custom software development projects.',
    canonical: `${siteConfig.baseUrl}/terms`,
  },
};
