import type { Metadata } from 'next';
import type { PageMetadata } from '@/types/content';
import { siteConfig } from '@/content/site';

/**
 * Generate Next.js Metadata from our typed PageMetadata.
 * Centralizes title template, OG defaults, and Twitter card config.
 */
export function generatePageMetadata(page: PageMetadata): Metadata {
  const title = page.title.includes('CodingBull')
    ? page.title
    : `${page.title} | CodingBull Technovations`;

  const ogImage = page.ogImage ?? `${siteConfig.baseUrl}/og/default.jpg`;

  return {
    title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: page.canonical,
    },
    openGraph: {
      title,
      description: page.description,
      url: page.canonical,
      siteName: siteConfig.companyName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
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
      'CodingBull builds custom digital systems for healthcare clinics, e-commerce operations, and workforce management. Fixed-price projects, founder-led delivery. Ahmedabad, India & USA.',
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
    title: 'Custom Software Development Company in India | CodingBull',
    description:
      'India-based custom software development for healthcare, e-commerce, and HRMS. Fixed-price projects with founder-led delivery. Serving India and international clients.',
    keywords: ['software development India', 'custom software company India'],
    canonical: `${siteConfig.baseUrl}/india`,
  },
  usa: {
    title: 'Custom Software Development for USA Businesses | CodingBull',
    description:
      'Custom healthcare, e-commerce, and HRMS software for USA businesses. Fixed-price projects, direct founder communication, India-based development team.',
    keywords: ['custom software USA', 'offshore software development', 'healthcare software USA'],
    canonical: `${siteConfig.baseUrl}/usa`,
  },
};
