import { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { insights } from '@/content/insights';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.codingbullz.com';

  // Core Pages
  const routes = [
    '',
    '/services',
    '/case-studies',
    '/insights',
    '/about',
    '/contact',
    '/ahmedabad',
    '/india',
    '/usa',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Service Pages
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Insight Pages
  const insightRoutes = insights.map((insight) => ({
    url: `${baseUrl}/insights/${insight.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Case Study Pages (Planned Slugs)
  const caseStudySlugs = ['physioway', 'shashwat-ivf', 'anr-mechanical'];
  const caseStudyRoutes = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...insightRoutes, ...caseStudyRoutes];
}
