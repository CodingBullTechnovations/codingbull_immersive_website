import { PageHero } from '@/components/sections/PageHero';
import { CaseStudyScrollShowcase } from '@/components/sections/CaseStudyScrollShowcase';
import { CTASection } from '@/components/sections/CTASection';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import Link from 'next/link';
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
  const proofCategories = [
    {
      title: 'Healthcare and clinic systems',
      href: '/services/healthcare-software-development',
      description: 'Clinic software, patient workflows, appointment systems, healthcare websites, and follow-up foundations.',
    },
    {
      title: 'Business websites and lead generation',
      href: '/web-development-company-ahmedabad',
      description: 'Business websites, proof-driven pages, inquiry paths, responsive presentation, and maintainable public sites.',
    },
    {
      title: 'Custom business systems',
      href: '/services/custom-business-systems',
      description: 'Internal CRM, workflow automation, dashboards, admin tools, reporting, and operating-system style builds.',
    },
  ];

  return (
    <>
      <PageHero
        title="Architecting Real Systems"
        subtitle="We build proprietary software that runs serious enterprises. Explore our deployed architectures in Healthcare, Supply Chain, and E-Commerce."
        badge="Case Studies"
        accentColor="amber"
      />

      <SectionWrapper className="border-b border-white/10 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Proof Hub</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Project proof for service buyers.</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              These case studies help buyers understand the industries CodingBull has worked in, the project types we can scope, and the service pages connected to each proof asset.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button label="Contact CodingBull" href="/contact" variant="primary" trackingSource="case_studies_hub_contact" />
              <Button label="Review Services" href="/services" variant="secondary" trackingSource="case_studies_hub_services" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {proofCategories.map((category) => (
              <Link key={category.href} href={category.href} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-teal/30 hover:bg-white/[0.05]">
                <h3 className="text-base font-semibold text-white">{category.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CaseStudyScrollShowcase studies={displayStudies} />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
