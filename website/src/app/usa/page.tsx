import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateOrganizationSchema } from '@/lib/schema';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { services } from '@/content/services';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata(pageMetadata.usa);

export default function USAPage() {
  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />
      <PageHero
        title="Custom Software Development for USA Businesses"
        subtitle="Premium digital architecture for American enterprises. Specialized in healthcare, e-commerce, and HRMS systems with security controls scoped to the project."
      />

      <SectionWrapper className="py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 italic tracking-tight">Enterprise Infrastructure, Simplified.</h2>
          <p className="text-white/60 text-lg mb-12">
            CodingBull provides USA-based enterprises with a unique combination: direct founder-led communication and a high-performance India-based engineering team. We deliver custom systems with privacy, access-control, and audit requirements scoped during discovery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-teal/30 transition-all">
              <h3 className="text-xl font-bold mb-4 text-teal italic">Direct Lead Access</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                No account managers. No lost translations. You discuss your architecture directly with our technical founders, ensuring every nuance of your business logic is captured.
              </p>
            </div>
            <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-teal/30 transition-all">
              <h3 className="text-xl font-bold mb-4 text-teal italic">Compliance First</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Whether it&apos;s PII protection for healthcare or secure payment flows for e-commerce, we build with US security standards as the foundation of our code.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Our Sector Expertise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-teal/50 hover:bg-teal/5 transition-all text-left group"
              >
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm font-bold uppercase tracking-widest text-teal mb-2 block">{service.accentColor} Sector</span>
                  <span className="text-lg font-semibold group-hover:text-white transition-colors">{service.title}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-16 rounded-[4rem] bg-gradient-to-br from-teal to-blue-600/20 border border-white/10 text-center shadow-[0_30px_100px_rgba(20,184,166,0.1)]">
            <h3 className="text-4xl font-black mb-8 italic">Scale your USA project now.</h3>
            <p className="text-white/70 mb-12 max-w-xl mx-auto text-lg leading-relaxed text-balance">
              Stop settling for generic SaaS limitations. Architect a proprietary system that gives your American business a lasting competitive advantage.
            </p>
            <Button
              label="Request US Quote"
              href="/contact"
              variant="primary"
              size="large"
              trackingSource="usa_page_cta"
            />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
