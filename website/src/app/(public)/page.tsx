import type { Metadata } from 'next';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { JsonLd, generateFAQSchema } from '@/lib/schema';
import { isCaseStudyPubliclyVisible, listVisibleCaseStudyStatuses } from '@/lib/server/public-content';
import { NeuralMind } from '@/components/animations/NeuralMind';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustBar } from '@/components/sections/TrustBar';
import { IndustryStory } from '@/components/sections/IndustryStory';
import { ProductSpotlight } from '@/components/sections/ProductSpotlight';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { FeaturedCaseStudies } from '@/components/sections/FeaturedCaseStudies';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { EngineeringNotesRail } from '@/components/sections/EngineeringNotesRail';
import { FounderNoteSection } from '@/components/sections/FounderNoteSection';
import { CTASection } from '@/components/sections/CTASection';
import { productsBySlug } from '@/content/products';

// Explicit self-canonical — never rely on inheriting the root layout.
export const metadata: Metadata = generatePageMetadata(pageMetadata.home);

export const revalidate = 60;

export default async function Home() {
  // Status-aware proof count: publicly visible DB studies (PUBLISHED +
  // APPROVED) plus static fallbacks not yet owned by the CMS — the same
  // visibility rule as the case-study hub, detail routes, and sitemap.
  const dbStatuses = await listVisibleCaseStudyStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const publishedCount =
    dbStatuses.filter(isCaseStudyPubliclyVisible).length +
    caseStudies.filter((study) => !dbStatusBySlug.has(study.slug)).length;
  const trustStats = homeContent.trustStats.map((stat) =>
    stat.label === 'Published case studies' ? { ...stat, value: String(publishedCount) } : stat,
  );

  return (
    <>
      <JsonLd data={generateFAQSchema(homeContent.faq)} />

      {/* One persistent particle mind travels behind the whole narrative. */}
      <NeuralMind />

      {/*
        The particle mind travels through meaningful formations as you scroll,
        directed by `data-mind-shape` on the sections below: it holds the logo,
        builds a system per industry (ECG, cart, workforce grid, node graph),
        resolves into an engineered circuit lattice, and returns to the bull.
      */}
      <div className="mind-page">
        {/* Opening — the mind holds the logo */}
        <div data-mind-shape="logo">
          <HeroSection content={homeContent.hero} />
          <TrustBar stats={trustStats} />
        </div>

        {/* Systems — the mind builds a different system per industry */}
        <IndustryStory items={homeContent.whatWeBuild} />

        {/* Proof — reads as node-graph systems */}
        <div data-mind-shape="custom">
          <FeaturedCaseStudies slugs={homeContent.featuredCaseStudies} />
        </div>

        {/* Proprietary product — RemoteRadar */}
        <ProductSpotlight product={productsBySlug['remote-radar']} />

        {/* Method — the mind orders itself into an engineered lattice */}
        <div data-mind-shape="lattice">
          <WhyChooseUs items={homeContent.whyChooseUs} />
          <ProcessSection steps={homeContent.process} />
        </div>

        {/* Human + close — the mind converges back to the bull */}
        <div data-mind-shape="logo">
          <FounderNoteSection content={homeContent.founderNote} />
          <FAQSection items={homeContent.faq} />
          <EngineeringNotesRail />
          <CTASection cta={homeContent.finalCTA} />
        </div>
      </div>
    </>
  );
}
