import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateLocalBusinessSchema } from '@/lib/schema';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { services } from '@/content/services';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata(pageMetadata.ahmedabad);

export default function AhmedabadPage() {
  return (
    <>
      <JsonLd data={generateLocalBusinessSchema({
        name: 'CodingBull Technovations Ahmedabad',
        city: 'Ahmedabad',
        region: 'Gujarat',
        country: 'India',
      })} />
      <PageHero
        title="Software Development in Ahmedabad"
        subtitle="Founder-led custom systems for Healthcare, E-commerce, and Enterprise HRMS. Built right here in Ahmedabad, delivered globally."
      />

      <SectionWrapper className="py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Ahmedabad&apos;s Enterprise Software Partner</h2>
          <p className="text-white/60 text-lg mb-12">
            Based in Satellite, Ahmedabad, CodingBull Technovations is not your average agency. We are a specialized technical architecture firm that builds proprietary systems for business owners who are tired of generic solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-teal">Local Expertise</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                We understand the Indian business landscape and local operational challenges, helping us build systems that actually work in the real world.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-teal">Global Standards</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Our code and architecture follow international best practices, ensuring your system is ready for global scale from day one.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Our Core Niches</h3>
          <div className="flex flex-wrap gap-4 mb-24">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-teal/50 hover:bg-teal/5 transition-all group"
              >
                <span className="font-semibold group-hover:text-teal transition-colors">{service.title}</span>
              </Link>
            ))}
          </div>

          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-teal/20 to-transparent border border-teal/20 text-center">
            <h3 className="text-3xl font-black mb-6 italic">Ready to build your system in Ahmedabad?</h3>
            <p className="text-white/60 mb-10 max-w-lg mx-auto">
              Skip the sales talk. Get a fixed-price quote directly from our founder for your custom software needs.
            </p>
            <Button
              label="Contact Local Office"
              href="/contact"
              variant="primary"
              size="large"
              trackingSource="ahmedabad_page_cta"
            />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
