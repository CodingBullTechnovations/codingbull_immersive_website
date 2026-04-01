import { homeContent } from '@/content/home';
import { JsonLd, generateFAQSchema } from '@/lib/schema';
import { HeroSection } from '@/components/sections/HeroSection';
import { TechStackMarquee } from '@/components/sections/TechStackMarquee';
import { TrustBar } from '@/components/sections/TrustBar';
import { WhatWeBuildSection } from '@/components/sections/WhatWeBuildSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { ResultsOrProofSection } from '@/components/sections/ResultsOrProofSection';
import { FeaturedCaseStudies } from '@/components/sections/FeaturedCaseStudies';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FounderNoteSection } from '@/components/sections/FounderNoteSection';
import { CTASection } from '@/components/sections/CTASection';

export default function Home() {
  return (
    <>
      <JsonLd data={generateFAQSchema(homeContent.faq)} />

      {/* 1. Hero */}
      <HeroSection content={homeContent.hero} />

      {/* 1.5 Tech Stack Marquee */}
      <TechStackMarquee />

      {/* 2. Trust Strip */}
      <TrustBar stats={homeContent.trustStats} />

      {/* 3. What We Build */}
      <WhatWeBuildSection items={homeContent.whatWeBuild} />

      {/* 4. Why Choose Us */}
      <WhyChooseUs items={homeContent.whyChooseUs} />

      {/* 5. Results / Proof */}
      <ResultsOrProofSection metrics={homeContent.proof} />

      {/* 6. Featured Case Studies */}
      <FeaturedCaseStudies slugs={homeContent.featuredCaseStudies} />

      {/* 7. Process */}
      <ProcessSection steps={homeContent.process} />

      {/* 8. Testimonials */}
      <TestimonialsSection />

      {/* 9. FAQ */}
      <FAQSection items={homeContent.faq} />

      {/* 10. Founder Note */}
      <FounderNoteSection content={homeContent.founderNote} />

      {/* 11. Final CTA */}
      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
