import { siteConfig } from '@/content/site';

// =============================================================================
// JSON-LD Schema Generators
// =============================================================================

/** Stable entity id so every schema block resolves to one Organization node. */
export const ORGANIZATION_ID = `${siteConfig.baseUrl}/#organization`;

export function organizationRef() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.companyName,
    url: siteConfig.baseUrl,
  };
}

export function generateOrganizationSchema(sameAs?: string[]) {
  const identityUrls = [...new Set((sameAs ?? Object.values(siteConfig.socialLinks)).filter(Boolean))];
  const address = {
    '@type': 'PostalAddress',
    ...(siteConfig.address.street ? { streetAddress: siteConfig.address.street } : {}),
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    addressCountry: siteConfig.address.country,
    ...(siteConfig.address.zip ? { postalCode: siteConfig.address.zip } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.companyName,
    legalName: siteConfig.companyName,
    alternateName: 'CodingBull Technovations',
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/images/logo/logo.png`,
    description: siteConfig.positioningStatement,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address,
    ...(siteConfig.registration.gst ? { taxID: siteConfig.registration.gst } : {}),
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Canada' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: 'sales',
    },
    ...(identityUrls.length ? { sameAs: identityUrls } : {}),
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.baseUrl}/#website`,
    name: siteConfig.companyName,
    url: siteConfig.baseUrl,
    publisher: organizationRef(),
    inLanguage: 'en',
  };
}

export function generateLocalBusinessSchema(location: {
  name: string;
  city: string;
  region: string;
  country: string;
  /** Admin-configured profile URLs (Google Business Profile especially). */
  sameAs?: string[];
}) {
  const identityUrls = [...new Set((location.sameAs ?? []).filter(Boolean))];

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': ORGANIZATION_ID,
    name: location.name,
    legalName: siteConfig.companyName,
    url: siteConfig.baseUrl,
    description: siteConfig.positioningStatement,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: location.country,
      // Only published when the owner has confirmed it (see site.ts).
      ...(siteConfig.address.zip ? { postalCode: siteConfig.address.zip } : {}),
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    ...(siteConfig.registration.gst ? { taxID: siteConfig.registration.gst } : {}),
    ...(identityUrls.length ? { sameAs: identityUrls } : {}),
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
    provider: organizationRef(),
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Canada' },
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
  dateModified?: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    // BlogPosting, not the generic Article. It is a subtype of Article (so
    // nothing is lost) and states explicitly to Google and AI crawlers that
    // this is blog content — the actual machine-readable signal, which a word
    // in the URL is not.
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: organizationRef(),
    image: article.image,
  };
}

export function generateCreativeWorkSchema(work: {
  name: string;
  description: string;
  url: string;
  about?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.name,
    description: work.description,
    url: work.url,
    about: work.about,
    ...(work.dateModified ? { dateModified: work.dateModified } : {}),
    creator: organizationRef(),
  };
}

export function generateAboutPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${page.url}#about-page`,
    name: page.name,
    description: page.description,
    url: page.url,
    mainEntity: organizationRef(),
    isPartOf: { '@id': `${siteConfig.baseUrl}/#website` },
  };
}

export function generatePersonSchema(person: {
  name: string;
  jobTitle: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${person.url}#founder`,
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    worksFor: organizationRef(),
  };
}

export function generateContactPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${page.url}#contact-page`,
    name: page.name,
    description: page.description,
    url: page.url,
    about: organizationRef(),
    isPartOf: { '@id': `${siteConfig.baseUrl}/#website` },
  };
}

/**
 * Declares the index page as a Blog and names its posts. Together with the
 * BlogPosting type on each article this is what tells Google and AI systems
 * "this section is a blog", regardless of the URL path.
 */
export function generateBlogSchema(blog: {
  name: string;
  description: string;
  url: string;
  posts: Array<{ name: string; url: string; datePublished?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${blog.url}#blog`,
    name: blog.name,
    description: blog.description,
    url: blog.url,
    publisher: organizationRef(),
    inLanguage: 'en',
    blogPost: blog.posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.name,
      url: post.url,
      ...(post.datePublished ? { datePublished: post.datePublished } : {}),
      publisher: organizationRef(),
    })),
  };
}

export function generateItemListSchema(list: {
  name: string;
  url: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.name,
    url: list.url,
    numberOfItems: list.items.length,
    itemListElement: list.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

/**
 * A CodingBull-built product (e.g. RemoteRadar). Declares it as a real
 * software application authored by the organization, so Google and AI systems
 * can attribute the product to CodingBull when answering "what has CodingBull
 * built" — direct GEO/AEO value.
 */
export function generateSoftwareApplicationSchema(app: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  price?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: app.url,
    applicationCategory: app.applicationCategory,
    operatingSystem: app.operatingSystem ?? 'Web',
    author: organizationRef(),
    publisher: organizationRef(),
    offers: {
      '@type': 'Offer',
      price: app.price ?? '0',
      priceCurrency: 'USD',
    },
  };
}

// Helper to inject JSON-LD into page
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
