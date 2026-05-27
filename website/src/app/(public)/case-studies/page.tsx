import { PageHero } from '@/components/sections/PageHero';
import { CaseStudyScrollShowcase } from '@/components/sections/CaseStudyScrollShowcase';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { generatePageMetadata } from '@/lib/seo';
import { pageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata(pageMetadata.caseStudies);

export default function CaseStudiesPage() {
  // Map content structure to component structure
  const displayStudies = caseStudies.map(s => ({
    slug: s.slug,
    title: s.title,
    industry: s.category,
    description: s.challenge,
    highlights: s.techStack.slice(0, 4),
  }));

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
