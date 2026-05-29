import { PageHero } from '@/components/sections/PageHero';
import { CaseStudyScrollShowcase } from '@/components/sections/CaseStudyScrollShowcase';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getPublishedCaseStudyBySlug, listCaseStudySlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

export const revalidate = 60;

export const metadata: Metadata = generatePageMetadata(pageMetadata.caseStudies);

function architectureHighlights(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item !== 'object' || item === null) return '';
      return String((item as Record<string, unknown>).title ?? '').trim();
    })
    .filter(Boolean)
    .slice(0, 4);
}

export default async function CaseStudiesPage() {
  const dbStatuses = await listCaseStudySlugStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const dbStudies = await Promise.all(
    dbStatuses
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => getPublishedCaseStudyBySlug(item.slug)),
  );
  const dbDisplayStudies = dbStudies.flatMap((study) => {
    if (!study) return [];
    const highlights = architectureHighlights(study.architecture);

    return [{
      slug: study.slug,
      title: study.title,
      industry: study.industry,
      description: study.problem,
      highlights: highlights.length > 0 ? highlights : [study.client, study.seoIndustry.replaceAll('_', ' ')],
    }];
  });
  const staticDisplayStudies = caseStudies
    .filter((study) => !dbStatusBySlug.has(study.slug))
    .map((study) => ({
      slug: study.slug,
      title: study.title,
      industry: study.category,
      description: study.challenge,
      highlights: study.techStack.slice(0, 4),
    }));
  const displayStudies = [...dbDisplayStudies, ...staticDisplayStudies];

  return (
    <>
      <PageHero
        title="Architecting Real Systems"
        subtitle="We build proprietary software that runs serious enterprises. Explore our deployed architectures in Healthcare, Supply Chain, and E-Commerce."
        badge="Case Studies"
        accentColor="amber"
      />

      <CaseStudyScrollShowcase studies={displayStudies} />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
