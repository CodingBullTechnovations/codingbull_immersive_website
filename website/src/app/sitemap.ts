import { MetadataRoute } from 'next';
import { caseStudies } from '@/content/case-studies';
import { services } from '@/content/services';
import { insights } from '@/content/insights';
import { siteConfig } from '@/content/site';
import { listPublishedCaseStudySlugs, listPublishedInsightSlugs, listPublishedServiceSlugs } from '@/lib/server/public-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.baseUrl;
  const fallbackLastModified = new Date('2026-05-27T00:00:00.000Z');
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
    lastModified: fallbackLastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const serviceSlugs = new Set([...services.map((service) => service.slug), ...dbServices.map((service) => service.slug)]);
  const serviceRoutes = Array.from(serviceSlugs).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticInsightDates = new Map(insights.map((insight) => [insight.slug, new Date(`${insight.date}T00:00:00.000Z`)]));
  const insightSlugs = new Set([...insights.map((insight) => insight.slug), ...dbInsights.map((insight) => insight.slug)]);
  const insightRoutes = Array.from(insightSlugs).map((slug) => ({
    url: `${baseUrl}/insights/${slug}`,
    lastModified: staticInsightDates.get(slug) ?? fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const staticCaseStudyDates = new Map(caseStudies.map((study) => [study.slug, new Date(`${study.year}-01-01T00:00:00.000Z`)]));
  const caseStudySlugs = new Set(['physioway', 'shashwat-ivf', 'anr-mechanical', ...dbCaseStudies.map((study) => study.slug)]);
  const caseStudyRoutes = Array.from(caseStudySlugs).map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: staticCaseStudyDates.get(slug) ?? fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...insightRoutes, ...caseStudyRoutes];
}
