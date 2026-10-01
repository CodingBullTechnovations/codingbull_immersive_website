import { MetadataRoute } from 'next';
import { ContentStatus } from '@prisma/client';
import { caseStudies } from '@/content/case-studies';
import { services } from '@/content/services';
import { insights } from '@/content/insights';
import { products } from '@/content/products';
import { getInsightConversion } from '@/content/insight-conversion';
import { canonicalUrl } from '@/lib/seo';
import { isCaseStudyPubliclyVisible, listInsightSlugStatuses, listServiceSlugStatuses, listVisibleCaseStudyStatuses } from '@/lib/server/public-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dbServices, dbInsights, dbCaseStudies] = await Promise.all([
    listServiceSlugStatuses(),
    listInsightSlugStatuses(),
    listVisibleCaseStudyStatuses(),
  ]);

  const staticRouteModified = new Map([
    ['', new Date('2026-07-26T00:00:00.000Z')],
    ['/about', new Date('2026-07-26T00:00:00.000Z')],
    ['/contact', new Date('2026-07-26T00:00:00.000Z')],
    ['/ahmedabad', new Date('2026-07-26T00:00:00.000Z')],
    ['/software-development-company-ahmedabad', new Date('2026-07-26T00:00:00.000Z')],
    ['/india', new Date('2026-07-26T00:00:00.000Z')],
    ['/usa', new Date('2026-07-26T00:00:00.000Z')],
    ['/uae', new Date('2026-07-26T00:00:00.000Z')],
    ['/canada', new Date('2026-07-26T00:00:00.000Z')],
  ]);
  const routes = [
    '',
    '/services',
    '/case-studies',
    '/products',
    '/insights',
    '/about',
    '/contact',
    '/ahmedabad',
    '/software-development-company-ahmedabad',
    '/web-development-company-ahmedabad',
    '/india',
    '/usa',
    '/uae',
    '/canada',
    '/privacy',
    '/terms',
  ].map((route) => {
    const lastModified = staticRouteModified.get(route);
    return {
      url: canonicalUrl(route),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    };
  });

  const dbServiceStatusBySlug = new Map(dbServices.map((item) => [item.slug, item.status]));
  const dbServiceDates = new Map(
    dbServices
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .flatMap((item) => {
        const date = item.updatedAt ?? item.publishedAt;
        return date ? [[item.slug, date] as const] : [];
      }),
  );
  const serviceSlugs = new Set([
    ...dbServices.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...services.filter((item) => !dbServiceStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const staticServiceDates = new Map(
    services.flatMap((service) => service.updatedAt
      ? [[service.slug, new Date(`${service.updatedAt}T00:00:00.000Z`)] as const]
      : []),
  );
  const serviceRoutes = Array.from(serviceSlugs).map((slug) => {
    const isStaticService = services.some((service) => service.slug === slug);
    const lastModified = isStaticService ? staticServiceDates.get(slug) : dbServiceDates.get(slug);
    return {
      url: canonicalUrl(`/services/${slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  const staticInsightDates = new Map(insights.map((insight) => [
    insight.slug,
    new Date(`${insight.updatedAt ?? insight.date}T00:00:00.000Z`),
  ]));
  const dbInsightStatusBySlug = new Map(dbInsights.map((item) => [item.slug, item.status]));
  const dbInsightDates = new Map(
    dbInsights
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .flatMap((item) => {
        const date = item.contentUpdatedAt && (!item.publishedAt || item.contentUpdatedAt > item.publishedAt)
          ? item.contentUpdatedAt
          : item.publishedAt;
        return date ? [[item.slug, date] as const] : [];
      }),
  );
  const insightSlugs = new Set([
    ...dbInsights.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...insights.filter((item) => !dbInsightStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const insightRoutes = Array.from(insightSlugs).map((slug) => {
    const dbOwnsRoute = dbInsightStatusBySlug.get(slug) === ContentStatus.PUBLISHED;
    const articleDate = dbOwnsRoute ? dbInsightDates.get(slug) : staticInsightDates.get(slug);
    const supplementDate = getInsightConversion(slug)?.updatedAt;
    const candidateDates = [articleDate, supplementDate ? new Date(`${supplementDate}T00:00:00.000Z`) : undefined]
      .filter((date): date is Date => date !== undefined);
    const lastModified = candidateDates.length
      ? new Date(Math.max(...candidateDates.map((date) => date.getTime())))
      : undefined;
    return {
      url: canonicalUrl(`/insights/${slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  const staticCaseStudyDates = new Map(
    caseStudies.flatMap((study) => study.updatedAt
      ? [[study.slug, new Date(`${study.updatedAt}T00:00:00.000Z`)] as const]
      : []),
  );
  const dbCaseStudyStatusBySlug = new Map(dbCaseStudies.map((item) => [item.slug, item.status]));
  const dbCaseStudyDates = new Map(
    dbCaseStudies
      .filter(isCaseStudyPubliclyVisible)
      .flatMap((item) => {
        const date = item.updatedAt ?? item.publishedAt;
        return date ? [[item.slug, date] as const] : [];
      }),
  );
  const caseStudySlugs = new Set([
    ...dbCaseStudies.filter(isCaseStudyPubliclyVisible).map((item) => item.slug),
    ...caseStudies.filter((item) => !dbCaseStudyStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  const caseStudyRoutes = Array.from(caseStudySlugs).map((slug) => {
    const isStaticCaseStudy = caseStudies.some((study) => study.slug === slug);
    const lastModified = isStaticCaseStudy ? staticCaseStudyDates.get(slug) : dbCaseStudyDates.get(slug);
    return {
      url: canonicalUrl(`/case-studies/${slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  const productRoutes = products.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}`),
    ...(product.updatedAt ? { lastModified: new Date(`${product.updatedAt}T00:00:00.000Z`) } : {}),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes, ...insightRoutes, ...caseStudyRoutes, ...productRoutes];
}
