import { PageHero } from '@/components/sections/PageHero';
import { WhatWeBuildSection } from '@/components/sections/WhatWeBuildSection';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { generatePageMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';

export const metadata = generatePageMetadata({
  title: 'Enterprise Services & Solutions',
  description: 'Explore CodingBull software development services for healthcare systems, e-commerce platforms, HRMS/payroll, and custom business systems.',
  canonical: `${siteConfig.baseUrl}/services`,
});

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
