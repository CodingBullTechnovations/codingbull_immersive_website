import { PageHero } from '@/components/sections/PageHero';
import { CaseStudyScrollShowcase } from '@/components/sections/CaseStudyScrollShowcase';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getVisibleCaseStudyBySlug, isCaseStudyPubliclyVisible, listVisibleCaseStudyStatuses } from '@/lib/server/public-content';
import { JsonLd, generateItemListSchema } from '@/lib/schema';
import { siteConfig } from '@/content/site';

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
  const dbStatuses = await listVisibleCaseStudyStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const dbStudies = await Promise.all(
    dbStatuses
      .filter(isCaseStudyPubliclyVisible)
      .map((item) => getVisibleCaseStudyBySlug(item.slug)),
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
      <JsonLd data={generateItemListSchema({
        name: 'CodingBull case studies',
        url: `${siteConfig.baseUrl}/case-studies`,
        items: displayStudies.map((study) => ({
          name: study.title,
          url: `${siteConfig.baseUrl}/case-studies/${study.slug}`,
          description: study.description,
        })),
      })} />
      <PageHero
        title="Architecting Real Systems"
        subtitle="Published work across healthcare operations, clinic lead generation, and industrial digital proof—showing the constraints, systems, and delivery decisions behind each project."
        badge="Case Studies"
      />

      <CaseStudyScrollShowcase studies={displayStudies} />

      <TestimonialsSection />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
