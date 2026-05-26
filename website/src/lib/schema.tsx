import { siteConfig } from '@/content/site';

// =============================================================================
// JSON-LD Schema Generators
// =============================================================================

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.companyName,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/images/logo/logo.png`,
    description: siteConfig.positioningStatement,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      addressCountry: siteConfig.address.country,
      postalCode: siteConfig.address.zip,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: 'sales',
    },
    sameAs: Object.values(siteConfig.socialLinks).filter(Boolean),
  };
}

export function generateLocalBusinessSchema(location: {
  name: string;
  city: string;
  region: string;
  country: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.baseUrl}/#localbusiness`,
    name: `${siteConfig.companyName} — ${location.city}`,
    url: siteConfig.baseUrl,
    description: siteConfig.positioningStatement,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: location.country,
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '$$',
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: siteConfig.companyName,
      url: siteConfig.baseUrl,
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
    ],
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.companyName,
      url: siteConfig.baseUrl,
    },
    image: article.image,
  };
}

export function generateCreativeWorkSchema(work: {
  name: string;
  description: string;
  url: string;
  about?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.name,
    description: work.description,
    url: work.url,
    about: work.about,
    creator: {
      '@type': 'Organization',
      name: siteConfig.companyName,
      url: siteConfig.baseUrl,
    },
  };
}

// Helper to inject JSON-LD into page
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
