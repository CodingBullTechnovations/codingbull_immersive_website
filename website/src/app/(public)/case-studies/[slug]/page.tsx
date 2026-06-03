import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { caseStudies, caseStudiesBySlug, type CaseStudy } from '@/content/case-studies';
import { CaseStudyProofPage } from '@/components/sections/CaseStudyProofPage';
import { generatePageMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';
import { JsonLd, generateBreadcrumbSchema, generateCreativeWorkSchema } from '@/lib/schema';
import { getCaseStudyBySlug, listCaseStudySlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbStudies = await listCaseStudySlugStatuses();
  const dbStatusBySlug = new Map(dbStudies.map((item) => [item.slug, item.status]));
  const slugs = new Set([
    ...dbStudies.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...caseStudies.filter((item) => !dbStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbStudy = await getCaseStudyBySlug(slug);
  const study = dbStudy
    ? (dbStudy.status === ContentStatus.PUBLISHED ? mapDbCaseStudy(dbStudy) : null)
    : caseStudiesBySlug[slug];
  if (!study) return {};

  return generatePageMetadata({
    title: `${study.title} | Case Study | CodingBull`,
    description: study.challenge.substring(0, 160),
    canonical: `${siteConfig.baseUrl}/case-studies/${slug}`,
  });
}

function pairStats(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null;
      const record = item as Record<string, unknown>;
      return { label: String(record.label ?? ''), value: String(record.value ?? '') };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item?.label && item.value));
}

function mapDbCaseStudy(study: Awaited<ReturnType<typeof getCaseStudyBySlug>>): CaseStudy | null {
  if (!study) return null;
  const stats = pairStats(study.metrics);
  const architecture = Array.isArray(study.architecture) ? study.architecture : [];

  return {
    slug: study.slug,
    title: study.title,
    client: study.client,
    category: study.industry,
    year: String((study.publishedAt ?? study.createdAt).getFullYear()),
    accentColor: 'teal',
    challenge: study.problem,
    solution: study.solution,
    outcome: study.outcomes,
    stats,
    techStack: architecture
      .map((item) => (typeof item === 'object' && item !== null ? String((item as Record<string, unknown>).title ?? '') : ''))
      .filter(Boolean),
    summary: study.problem,
    projectType: study.industry,
    market: 'Not specified in public case-study data',
    mainServiceCategory: study.seoIndustry.replaceAll('_', ' '),
    deliveryModel: 'Founder-led custom build',
    status: study.permissionStatus === 'APPROVED' ? 'Published case study' : 'Public case study',
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const dbStudy = await getCaseStudyBySlug(slug);
  const study = dbStudy
    ? (dbStudy.status === ContentStatus.PUBLISHED ? mapDbCaseStudy(dbStudy) : null)
    : caseStudiesBySlug[slug];
  if (!study) notFound();

  const caseUrl = `${siteConfig.baseUrl}/case-studies/${study.slug}`;

  return (
    <>
      <JsonLd data={generateCreativeWorkSchema({
        name: study.title,
        description: study.challenge,
        url: caseUrl,
        about: study.category,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Case Studies', url: `${siteConfig.baseUrl}/case-studies` },
        { name: study.client, url: caseUrl },
      ])} />

      <CaseStudyProofPage study={study} />
    </>
  );
}
