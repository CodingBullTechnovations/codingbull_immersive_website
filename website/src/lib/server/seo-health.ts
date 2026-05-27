import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ContentStatus, type SeoIndustry } from '@prisma/client';
import generateSitemap from '@/app/sitemap';
import { caseStudies } from '@/content/case-studies';
import { insights } from '@/content/insights';
import { services } from '@/content/services';
import { siteConfig } from '@/content/site';
import { getIndustryForPath, industryLabels } from '@/lib/industry';
import { defaultOgImage, defaultOgImageDimensions, pageMetadata } from '@/lib/seo';
import { listCaseStudySlugStatuses, listInsightSlugStatuses, listServiceSlugStatuses } from '@/lib/server/public-content';
import { prisma } from '@/lib/server/prisma';

export type SeoHealthSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SeoHealthIssue {
  severity: SeoHealthSeverity;
  route: string;
  title: string;
  detail: string;
  source: string;
}

interface SeoPageCandidate {
  route: string;
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  updatedAt?: Date | null;
  expectedSchema: string[];
  implementedSchema: string[];
  internalLinks: string[];
  industry: SeoIndustry;
  source: string;
  shouldIndex: boolean;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
}

const titleMin = 30;
const titleMax = 65;
const descriptionMin = 90;
const descriptionMax = 170;

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function addIssue(issues: SeoHealthIssue[], issue: SeoHealthIssue) {
  issues.push(issue);
}

function canonicalFor(route: string) {
  return `${siteConfig.baseUrl}${route === '/' ? '' : route}`;
}

function metadataCandidate(key: keyof typeof pageMetadata, route: string, implementedSchema: string[]): SeoPageCandidate {
  const metadata = pageMetadata[key];
  const expectedSchema =
    route === '/'
      ? ['Organization', 'WebSite', 'FAQPage']
      : route === '/ahmedabad'
        ? ['LocalBusiness']
        : route === '/india' || route === '/usa'
          ? ['Organization']
          : [];

  return {
    route,
    title: metadata.title,
    description: metadata.description,
    canonical: metadata.canonical,
    expectedSchema,
    implementedSchema,
    internalLinks: [],
    industry: getIndustryForPath(route),
    source: `static:${key}`,
    shouldIndex: !metadata.noIndex,
    updatedAt: null,
    ogImage: metadata.ogImage ?? defaultOgImage,
    ogImageWidth: metadata.ogImageWidth ?? defaultOgImageDimensions.width,
    ogImageHeight: metadata.ogImageHeight ?? defaultOgImageDimensions.height,
  };
}

function checkTextLength(issues: SeoHealthIssue[], page: SeoPageCandidate) {
  const title = page.title?.trim() ?? '';
  const description = page.description?.trim() ?? '';

  if (!title) {
    addIssue(issues, { severity: 'Critical', route: page.route, title: 'Missing title', detail: 'Page has no title metadata.', source: page.source });
  } else if (title.length < titleMin || title.length > titleMax) {
    addIssue(issues, { severity: 'Medium', route: page.route, title: 'Weak title length', detail: `Title is ${title.length} characters. Target ${titleMin}-${titleMax}.`, source: page.source });
  }

  if (!description) {
    addIssue(issues, { severity: 'Critical', route: page.route, title: 'Missing meta description', detail: 'Page has no meta description.', source: page.source });
  } else if (description.length < descriptionMin || description.length > descriptionMax) {
    addIssue(issues, { severity: 'Medium', route: page.route, title: 'Weak meta description length', detail: `Description is ${description.length} characters. Target ${descriptionMin}-${descriptionMax}.`, source: page.source });
  }
}

function checkCanonical(issues: SeoHealthIssue[], page: SeoPageCandidate, canonicalCounts: Map<string, number>) {
  if (!page.canonical) {
    addIssue(issues, { severity: 'High', route: page.route, title: 'Missing canonical', detail: 'Public indexable page should declare a canonical URL.', source: page.source });
    return;
  }

  if (!page.canonical.startsWith(siteConfig.baseUrl)) {
    addIssue(issues, { severity: 'High', route: page.route, title: 'Canonical domain mismatch', detail: `Canonical must use ${siteConfig.baseUrl}.`, source: page.source });
  }

  if ((canonicalCounts.get(page.canonical) ?? 0) > 1) {
    addIssue(issues, { severity: 'High', route: page.route, title: 'Duplicate canonical', detail: `${page.canonical} is shared by multiple candidates.`, source: page.source });
  }
}

function checkSchema(issues: SeoHealthIssue[], page: SeoPageCandidate) {
  for (const schema of page.expectedSchema) {
    if (!page.implementedSchema.includes(schema)) {
      addIssue(issues, {
        severity: 'High',
        route: page.route,
        title: `Missing ${schema} schema`,
        detail: `${schema} is expected for this route type but is not wired in the current template/content mapping.`,
        source: page.source,
      });
    }
  }
}

function checkInternalLinks(issues: SeoHealthIssue[], page: SeoPageCandidate) {
  if ((page.route.startsWith('/services/') || page.route.startsWith('/case-studies/') || page.route.startsWith('/insights/')) && page.internalLinks.length === 0) {
    addIssue(issues, {
      severity: 'Medium',
      route: page.route,
      title: 'Missing managed internal links',
      detail: 'Add internalLinkTargets in admin so industry clusters can be measured and maintained from the backend.',
      source: page.source,
    });
  }
}

function checkFreshness(issues: SeoHealthIssue[], page: SeoPageCandidate) {
  if (!page.updatedAt) return;
  const ageDays = Math.floor((Date.now() - page.updatedAt.getTime()) / (24 * 60 * 60 * 1000));
  if (ageDays > 180) {
    addIssue(issues, {
      severity: 'Low',
      route: page.route,
      title: 'Stale published content',
      detail: `Published content has not been updated for ${ageDays} days.`,
      source: page.source,
    });
  }
}

function checkRobotsGroups(issues: SeoHealthIssue[], robotsText: string) {
  const groups = robotsText
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => block.split('\n').map((line) => line.trim()));

  for (const lines of groups) {
    const userAgent = lines.find((line) => line.toLowerCase().startsWith('user-agent:'));
    if (!userAgent) continue;
    const hasAdminDisallow = lines.some((line) => line.toLowerCase() === 'disallow: /admin/');
    const hasApiDisallow = lines.some((line) => line.toLowerCase() === 'disallow: /api/');
    if (!hasAdminDisallow || !hasApiDisallow) {
      addIssue(issues, {
        severity: 'High',
        route: '/robots.txt',
        title: 'Crawler group missing protected route disallow',
        detail: `${userAgent} must explicitly disallow both /admin/ and /api/.`,
        source: 'robots.txt',
      });
    }
  }
}

function imageUrlToLocalPath(imageUrl: string) {
  const cleanUrl = imageUrl.trim();
  if (!cleanUrl) return null;
  if (cleanUrl.startsWith('/')) return cleanUrl;

  try {
    const parsed = new URL(cleanUrl);
    return parsed.pathname;
  } catch {
    return null;
  }
}

async function getOgAssetDimensions(localPath: string) {
  const ogPath = resolve(process.cwd(), `public${localPath}`);
  const buffer = await readFile(ogPath);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature)) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

export async function getSeoHealthIssues() {
  const [dbServices, dbInsights, dbCaseStudies, dailyMetrics, searchRows, serviceStatuses, insightStatuses, caseStudyStatuses, sitemapEntries] = await Promise.all([
    prisma.servicePage.findMany({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.insightPost.findMany({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.caseStudy.findMany({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.pageMetricDaily.groupBy({ by: ['page'], _sum: { visits: true } }),
    prisma.searchPerformanceDaily.groupBy({
      by: ['page'],
      _sum: { clicks: true, impressions: true },
      _avg: { ctr: true, averagePosition: true },
    }),
    listServiceSlugStatuses(),
    listInsightSlugStatuses(),
    listCaseStudySlugStatuses(),
    generateSitemap(),
  ]);

  const serviceStatusBySlug = new Map(serviceStatuses.map((item) => [item.slug, item.status]));
  const insightStatusBySlug = new Map(insightStatuses.map((item) => [item.slug, item.status]));
  const caseStudyStatusBySlug = new Map(caseStudyStatuses.map((item) => [item.slug, item.status]));

  const pages: SeoPageCandidate[] = [
    metadataCandidate('home', '/', ['Organization', 'WebSite', 'FAQPage']),
    metadataCandidate('about', '/about', []),
    metadataCandidate('contact', '/contact', []),
    metadataCandidate('caseStudies', '/case-studies', []),
    metadataCandidate('insights', '/insights', []),
    metadataCandidate('ahmedabad', '/ahmedabad', ['LocalBusiness']),
    metadataCandidate('india', '/india', ['Organization']),
    metadataCandidate('usa', '/usa', ['Organization']),
    metadataCandidate('privacy', '/privacy', []),
    metadataCandidate('terms', '/terms', []),
    ...services
      .filter((service) => !serviceStatusBySlug.has(service.slug))
      .map((service) => ({
        route: `/services/${service.slug}`,
        title: service.title,
        description: service.description,
        canonical: canonicalFor(`/services/${service.slug}`),
        expectedSchema: ['Service', ...(service.faqs?.length ? ['FAQPage'] : []), 'BreadcrumbList'],
        implementedSchema: ['Service', ...(service.faqs?.length ? ['FAQPage'] : []), 'BreadcrumbList'],
        internalLinks: [],
        industry: getIndustryForPath(`/services/${service.slug}`),
        source: 'static:service',
        shouldIndex: true,
        updatedAt: null,
      })),
    ...insights
      .filter((post) => !insightStatusBySlug.has(post.slug))
      .map((post) => ({
        route: `/insights/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        canonical: canonicalFor(`/insights/${post.slug}`),
        expectedSchema: ['Article', 'BreadcrumbList'],
        implementedSchema: ['Article', 'BreadcrumbList'],
        internalLinks: [],
        industry: getIndustryForPath(`/insights/${post.slug}`),
        source: 'static:insight',
        shouldIndex: true,
        updatedAt: new Date(`${post.date}T00:00:00.000Z`),
      })),
    ...caseStudies
      .filter((study) => !caseStudyStatusBySlug.has(study.slug))
      .map((study) => ({
        route: `/case-studies/${study.slug}`,
        title: `${study.title} | Case Study | CodingBull`,
        description: study.challenge,
        canonical: canonicalFor(`/case-studies/${study.slug}`),
        expectedSchema: ['CreativeWork', 'BreadcrumbList'],
        implementedSchema: ['CreativeWork', 'BreadcrumbList'],
        internalLinks: [],
        industry: getIndustryForPath(`/case-studies/${study.slug}`),
        source: 'static:case-study',
        shouldIndex: true,
        updatedAt: new Date(`${study.year}-01-01T00:00:00.000Z`),
      })),
    ...dbServices.map((service) => ({
      route: `/services/${service.slug}`,
      title: service.metaTitle || service.title,
      description: service.metaDescription,
      canonical: service.canonicalPath ? `${siteConfig.baseUrl}${service.canonicalPath.startsWith('/') ? service.canonicalPath : `/${service.canonicalPath}`}` : canonicalFor(`/services/${service.slug}`),
      expectedSchema: ['Service', 'BreadcrumbList', ...(Array.isArray(service.faqs) && service.faqs.length > 0 ? ['FAQPage'] : [])],
      implementedSchema: ['Service', 'BreadcrumbList', ...(Array.isArray(service.faqs) && service.faqs.length > 0 ? ['FAQPage'] : [])],
      internalLinks: service.internalLinkTargets,
      industry: service.seoIndustry,
      source: 'cms:service',
      shouldIndex: true,
      updatedAt: service.updatedAt,
    })),
    ...dbInsights.map((post) => ({
      route: `/insights/${post.slug}`,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      canonical: post.canonicalPath ? `${siteConfig.baseUrl}${post.canonicalPath.startsWith('/') ? post.canonicalPath : `/${post.canonicalPath}`}` : canonicalFor(`/insights/${post.slug}`),
      expectedSchema: ['Article', 'BreadcrumbList'],
      implementedSchema: ['Article', 'BreadcrumbList'],
      internalLinks: post.internalLinkTargets,
      industry: post.seoIndustry,
      source: 'cms:insight',
      shouldIndex: true,
      updatedAt: post.updatedAt,
    })),
    ...dbCaseStudies.map((study) => ({
      route: `/case-studies/${study.slug}`,
      title: `${study.title} | Case Study | CodingBull`,
      description: study.problem,
      canonical: study.canonicalPath ? `${siteConfig.baseUrl}${study.canonicalPath.startsWith('/') ? study.canonicalPath : `/${study.canonicalPath}`}` : canonicalFor(`/case-studies/${study.slug}`),
      expectedSchema: ['CreativeWork', 'BreadcrumbList'],
      implementedSchema: ['CreativeWork', 'BreadcrumbList'],
      internalLinks: study.internalLinkTargets,
      industry: study.seoIndustry,
      source: 'cms:case-study',
      shouldIndex: true,
      updatedAt: study.updatedAt,
    })),
  ];

  const issues: SeoHealthIssue[] = [];
  const canonicalCounts = new Map<string, number>();
  for (const page of pages) {
    if (page.canonical) canonicalCounts.set(page.canonical, (canonicalCounts.get(page.canonical) ?? 0) + 1);
  }

  const trafficByPage = new Map(dailyMetrics.map((row) => [row.page, row._sum.visits ?? 0]));
  const hasTrafficData = dailyMetrics.length > 0;
  const searchByPage = new Map(searchRows.map((row) => [row.page, row]));
  const hasSearchData = searchRows.length > 0;
  const sitemapPaths = new Set(
    sitemapEntries.map((entry) => {
      try {
        return new URL(entry.url).pathname;
      } catch {
        return entry.url;
      }
    }),
  );

  for (const page of pages) {
    if (!page.shouldIndex) continue;

    checkTextLength(issues, page);
    checkCanonical(issues, page, canonicalCounts);
    checkSchema(issues, page);
    checkInternalLinks(issues, page);
    checkFreshness(issues, page);

    if (!sitemapPaths.has(page.route)) {
      addIssue(issues, {
        severity: 'High',
        route: page.route,
        title: 'Missing from sitemap',
        detail: 'Indexable public page should be included in sitemap output.',
        source: page.source,
      });
    }

    if (hasTrafficData && !trafficByPage.get(page.route) && !['/privacy', '/terms'].includes(page.route)) {
      addIssue(issues, { severity: 'Low', route: page.route, title: 'No first-party traffic', detail: 'No first-party visits recorded for this page yet.', source: page.source });
    }

    const search = searchByPage.get(canonicalFor(page.route)) ?? searchByPage.get(page.route);
    if (hasSearchData && search && (search._sum.impressions ?? 0) >= 100 && Number(search._avg.ctr ?? 0) < 0.02) {
      addIssue(issues, {
        severity: 'Medium',
        route: page.route,
        title: 'Low CTR opportunity',
        detail: `${search._sum.impressions ?? 0} impressions with low Search Console CTR. Review title/meta and snippet fit.`,
        source: page.source,
      });
    }
  }

  const ogDimensionsCache = new Map<string, { width: number; height: number } | null>();
  for (const page of pages.filter((item) => item.shouldIndex)) {
    const configuredOg = page.ogImage ?? defaultOgImage;
    const expectedWidth = page.ogImageWidth ?? defaultOgImageDimensions.width;
    const expectedHeight = page.ogImageHeight ?? defaultOgImageDimensions.height;
    const localPath = imageUrlToLocalPath(configuredOg);

    if (!localPath || !localPath.endsWith('.png')) continue;

    if (!ogDimensionsCache.has(localPath)) {
      try {
        ogDimensionsCache.set(localPath, await getOgAssetDimensions(localPath));
      } catch {
        ogDimensionsCache.set(localPath, null);
      }
    }

    const dimensions = ogDimensionsCache.get(localPath);
    if (!dimensions) {
      addIssue(issues, {
        severity: 'High',
        route: page.route,
        title: 'OG image unreadable',
        detail: `Configured OG image ${localPath} is missing or not a valid PNG.`,
        source: page.source,
      });
      continue;
    }

    if (dimensions.width !== expectedWidth || dimensions.height !== expectedHeight) {
      addIssue(issues, {
        severity: 'High',
        route: page.route,
        title: 'OG image dimension mismatch',
        detail: `Metadata expects ${expectedWidth}x${expectedHeight}, asset is ${dimensions.width}x${dimensions.height}.`,
        source: page.source,
      });
    }
  }

  const accidentalSitemapPaths = Array.from(sitemapPaths).filter((path) => path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next'));
  for (const path of accidentalSitemapPaths) {
    addIssue(issues, {
      severity: 'Critical',
      route: path,
      title: 'Internal route included in sitemap',
      detail: 'Admin, API, and framework routes must never be included in sitemap output.',
      source: 'sitemap',
    });
  }

  for (const [key, meta] of Object.entries(pageMetadata)) {
    if (meta.noIndex) {
      addIssue(issues, {
        severity: 'High',
        route: meta.canonical.replace(siteConfig.baseUrl, '') || '/',
        title: 'Public metadata marked noindex',
        detail: `pageMetadata.${key} has noIndex enabled.`,
        source: 'metadata',
      });
    }
  }

  try {
    const [robotsText, proxyText, adminLayoutText] = await Promise.all([
      readFile(resolve(process.cwd(), 'public/robots.txt'), 'utf8'),
      readFile(resolve(process.cwd(), 'src/proxy.ts'), 'utf8'),
      readFile(resolve(process.cwd(), 'src/app/admin/(protected)/layout.tsx'), 'utf8'),
    ]);

    checkRobotsGroups(issues, robotsText);

    if (!proxyText.includes('/api/:path*') || !proxyText.toLowerCase().includes('x-robots-tag') || !proxyText.includes('noindex, nofollow')) {
      addIssue(issues, {
        severity: 'Critical',
        route: '/api',
        title: 'API routes may be indexable',
        detail: 'Proxy must match /api/:path* and set X-Robots-Tag: noindex, nofollow.',
        source: 'proxy',
      });
    }

    if (!adminLayoutText.includes('index: false') || !adminLayoutText.includes('follow: false')) {
      addIssue(issues, {
        severity: 'High',
        route: '/admin',
        title: 'Admin metadata robots not explicit noindex',
        detail: 'Admin layout metadata should explicitly set index=false and follow=false.',
        source: 'admin-layout',
      });
    }
  } catch (error) {
    addIssue(issues, {
      severity: 'Medium',
      route: '/seo-health',
      title: 'Unable to validate routing/indexing protection files',
      detail: error instanceof Error ? error.message : 'Unknown file read error',
      source: 'filesystem',
    });
  }

  const byIndustry = Object.entries(industryLabels).map(([industry, label]) => ({
    industry,
    label,
    issues: issues.filter((issue) => getIndustryForPath(issue.route) === industry).length,
  }));

  return {
    issues: issues.sort((a, b) => severityWeight(a.severity) - severityWeight(b.severity)),
    byIndustry,
    hasTrafficData,
    hasSearchData,
  };
}

function severityWeight(severity: SeoHealthSeverity) {
  return { Critical: 0, High: 1, Medium: 2, Low: 3 }[severity];
}
