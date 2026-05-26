import { ContentStatus } from '@prisma/client';
import { isDatabaseConfigured, prisma } from '@/lib/server/prisma';

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
        select: { slug: true },
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

export async function listPublishedInsightSlugs() {
  return safeQuery(
    () =>
      prisma.insightPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true },
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

export async function listPublishedCaseStudySlugs() {
  return safeQuery(
    () =>
      prisma.caseStudy.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true },
      }),
    [],
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
