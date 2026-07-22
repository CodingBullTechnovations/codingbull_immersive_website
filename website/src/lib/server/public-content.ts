import { ContentStatus, PermissionStatus } from '@prisma/client';
import { isDatabaseConfigured, prisma } from '@/lib/server/prisma';

/**
 * A case study is publicly visible only when it is PUBLISHED *and* the client
 * has APPROVED publicising it. Every public surface (homepage count, hub,
 * detail route, static params, sitemap, schemas) must use this single rule.
 */
export function isCaseStudyPubliclyVisible(study: {
  status: ContentStatus;
  permissionStatus: PermissionStatus;
}) {
  return study.status === ContentStatus.PUBLISHED && study.permissionStatus === PermissionStatus.APPROVED;
}

async function safeQuery<T>(query: () => Promise<T>, fallback: T) {
  if (!isDatabaseConfigured()) return fallback;

  try {
    return await query();
  } catch (error) {
    console.error('[public_content_query_failed]', error);
    return fallback;
  }
}

export async function listPublishedServiceSlugs() {
  return safeQuery(
    () =>
      prisma.servicePage.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function listServiceSlugStatuses() {
  return safeQuery(
    () =>
      prisma.servicePage.findMany({
        select: { slug: true, status: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function getPublishedServiceBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.servicePage.findFirst({
        where: { slug, status: ContentStatus.PUBLISHED },
      }),
    null,
  );
}

export async function getServiceBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.servicePage.findUnique({
        where: { slug },
      }),
    null,
  );
}

export async function listPublishedInsightSlugs() {
  return safeQuery(
    () =>
      prisma.insightPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function listInsightSlugStatuses() {
  return safeQuery(
    () =>
      prisma.insightPost.findMany({
        select: { slug: true, status: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function getPublishedInsightBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.insightPost.findFirst({
        where: { slug, status: ContentStatus.PUBLISHED },
      }),
    null,
  );
}

export async function getInsightBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.insightPost.findUnique({
        where: { slug },
      }),
    null,
  );
}

export async function listPublishedCaseStudySlugs() {
  return safeQuery(
    () =>
      prisma.caseStudy.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function listCaseStudySlugStatuses() {
  return safeQuery(
    () =>
      prisma.caseStudy.findMany({
        select: { slug: true, status: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

/** All CMS rows with the fields needed for the public-visibility rule. */
export async function listVisibleCaseStudyStatuses() {
  return safeQuery(
    () =>
      prisma.caseStudy.findMany({
        select: { slug: true, status: true, permissionStatus: true, publishedAt: true, updatedAt: true },
      }),
    [],
  );
}

export async function getVisibleCaseStudyBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.caseStudy.findFirst({
        where: { slug, status: ContentStatus.PUBLISHED, permissionStatus: PermissionStatus.APPROVED },
      }),
    null,
  );
}

export async function getPublishedCaseStudyBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.caseStudy.findFirst({
        where: { slug, status: ContentStatus.PUBLISHED },
      }),
    null,
  );
}

export async function getCaseStudyBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.caseStudy.findUnique({
        where: { slug },
      }),
    null,
  );
}

export async function getPublishedTestimonials(limit = 6) {
  return safeQuery(
    () =>
      prisma.testimonial.findMany({
        where: { status: ContentStatus.PUBLISHED, permissionStatus: PermissionStatus.APPROVED },
        orderBy: { order: 'asc' },
        take: limit,
      }),
    [],
  );
}
