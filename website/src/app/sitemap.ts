import { MetadataRoute } from 'next';
import { services } from '@/content/services';
import { insights } from '@/content/insights';
import { siteConfig } from '@/content/site';
import { listPublishedCaseStudySlugs, listPublishedInsightSlugs, listPublishedServiceSlugs } from '@/lib/server/public-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.baseUrl;
  const [dbServices, dbInsights, dbCaseStudies] = await Promise.all([
    listPublishedServiceSlugs(),
    listPublishedInsightSlugs(),
    listPublishedCaseStudySlugs(),
  ]);

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

  const serviceSlugs = new Set([...services.map((service) => service.slug), ...dbServices.map((service) => service.slug)]);
  const serviceRoutes = Array.from(serviceSlugs).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const insightSlugs = new Set([...insights.map((insight) => insight.slug), ...dbInsights.map((insight) => insight.slug)]);
  const insightRoutes = Array.from(insightSlugs).map((slug) => ({
    url: `${baseUrl}/insights/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const caseStudySlugs = new Set(['physioway', 'shashwat-ivf', 'anr-mechanical', ...dbCaseStudies.map((study) => study.slug)]);
  const caseStudyRoutes = Array.from(caseStudySlugs).map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...insightRoutes, ...caseStudyRoutes];
}
