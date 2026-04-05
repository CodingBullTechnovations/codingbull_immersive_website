import { PageHero } from '@/components/sections/PageHero';
import { WhatWeBuildSection } from '@/components/sections/WhatWeBuildSection';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';

export const metadata = {
  title: 'Enterprise Services & Solutions | CodingBull Technovations',
  description: 'Explore our premium software development services including Healthcare Systems, E-commerce, HRMS, Clinic Websites, and Custom CRM Solutions.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Enterprise Software Services"
        subtitle="We engineer proprietary digital systems that scale. From healthcare scheduling to e-commerce architecture — each solution is custom-built around your specific operational workflow."
        badge="Our Expertise"
        accentColor="teal"
      />

      <div className="relative z-10 -mt-12 lg:-mt-20">
        <WhatWeBuildSection />
      </div>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
