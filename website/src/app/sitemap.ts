import { MetadataRoute } from 'next';
import { ContentStatus } from '@prisma/client';
import { caseStudies } from '@/content/case-studies';
import { services } from '@/content/services';
import { insights } from '@/content/insights';
import { siteConfig } from '@/content/site';
import { listCaseStudySlugStatuses, listInsightSlugStatuses, listServiceSlugStatuses } from '@/lib/server/public-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.baseUrl;
  const fallbackLastModified = new Date('2026-05-27T00:00:00.000Z');
  const [dbServices, dbInsights, dbCaseStudies] = await Promise.all([
    listServiceSlugStatuses(),
    listInsightSlugStatuses(),
    listCaseStudySlugStatuses(),
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
    '/uae',
    '/canada',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: fallbackLastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dbServiceStatusBySlug = new Map(dbServices.map((item) => [item.slug, item.status]));
  const dbServiceDates = new Map(
    dbServices
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => [item.slug, item.updatedAt ?? item.publishedAt ?? fallbackLastModified]),
  );
  const serviceSlugs = new Set([
    ...dbServices.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...services.filter((item) => !dbServiceStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const serviceRoutes = Array.from(serviceSlugs).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: dbServiceDates.get(slug) ?? fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticInsightDates = new Map(insights.map((insight) => [insight.slug, new Date(`${insight.date}T00:00:00.000Z`)]));
  const dbInsightStatusBySlug = new Map(dbInsights.map((item) => [item.slug, item.status]));
  const dbInsightDates = new Map(
    dbInsights
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => [item.slug, item.updatedAt ?? item.publishedAt ?? fallbackLastModified]),
  );
  const insightSlugs = new Set([
    ...dbInsights.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...insights.filter((item) => !dbInsightStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const insightRoutes = Array.from(insightSlugs).map((slug) => ({
    url: `${baseUrl}/insights/${slug}`,
    lastModified: dbInsightDates.get(slug) ?? staticInsightDates.get(slug) ?? fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const staticCaseStudyDates = new Map(caseStudies.map((study) => [study.slug, new Date(`${study.year}-01-01T00:00:00.000Z`)]));
  const dbCaseStudyStatusBySlug = new Map(dbCaseStudies.map((item) => [item.slug, item.status]));
  const dbCaseStudyDates = new Map(
    dbCaseStudies
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => [item.slug, item.updatedAt ?? item.publishedAt ?? fallbackLastModified]),
  );
  const caseStudySlugs = new Set([
    ...dbCaseStudies.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...caseStudies.filter((item) => !dbCaseStudyStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const caseStudyRoutes = Array.from(caseStudySlugs).map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: dbCaseStudyDates.get(slug) ?? staticCaseStudyDates.get(slug) ?? fallbackLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...insightRoutes, ...caseStudyRoutes];
}
