import { PageHero } from '@/components/sections/PageHero';
import { FounderNoteSection } from '@/components/sections/FounderNoteSection';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import { RelatedLinksRail } from '@/components/sections/RelatedLinksRail';
import { primaryEntryPoints } from '@/content/link-graph';
import { siteConfig } from '@/content/site';
import { JsonLd, generateAboutPageSchema, generateBreadcrumbSchema, generatePersonSchema } from '@/lib/schema';

export const metadata = generatePageMetadata(pageMetadata.about);

export default function AboutPage() {
  const pageUrl = `${siteConfig.baseUrl}/about`;

  return (
    <>
      <JsonLd data={generateAboutPageSchema({
        name: 'About CodingBull Technovations',
        description: 'Founder-led custom software company based in Ahmedabad, India.',
        url: pageUrl,
      })} />
      <JsonLd data={generatePersonSchema({
        name: 'Pranshu Dixit',
        jobTitle: 'Founder',
        url: pageUrl,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'About CodingBull', url: pageUrl },
      ])} />
      <PageHero
        title="Founder-led by design."
        subtitle="CodingBull Technovations is an Ahmedabad-based custom software company built around direct technical ownership, workflow-first architecture, and fixed-scope delivery."
        badge="About CodingBull"
      />

      <section className="border-b border-white/[0.08] bg-[#05070a] px-5 py-16 sm:px-8 lg:px-10 lg:py-20" aria-label="Company facts">
        <div className="mx-auto grid max-w-[var(--max-w-wide)] divide-y divide-white/10 border-y border-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {[
            ['Entity', 'CodingBull Technovations Pvt. Ltd.'],
            ['Base', 'Ahmedabad, Gujarat, India'],
            ['Registration', 'GSTIN 24AAMCC7617E1ZP'],
            ['Focus', 'Healthcare · Commerce · HRMS · Custom Ops'],
          ].map(([label, value]) => (
            <div key={label} className="p-6 sm:p-7">
              <p className="cb-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-soft)]">{label}</p>
              <p className="mt-4 text-sm leading-6 text-white/70">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <WhyChooseUs items={homeContent.whyChooseUs} />
      <FounderNoteSection content={homeContent.founderNote} />
      <RelatedLinksRail
        kicker="Where to next"
        title="See the work behind the model."
        links={primaryEntryPoints}
      />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
