import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateOrganizationSchema } from '@/lib/schema';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { services } from '@/content/services';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata(pageMetadata.india);

export default function IndiaPage() {
  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />
      <PageHero
        title="Custom Software Development in India"
        subtitle="Premier technical architecture for Indian enterprises. Specialized in Healthcare clinics, E-commerce, and HRMS for scaling businesses."
      />

      <SectionWrapper className="py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 italic">Engineering the Future of Indian Industry</h2>
          <p className="text-white/60 text-lg mb-12">
            CodingBull provides high-end custom software development services across India. From Delhi to Bangalore, Mumbai to Ahmedabad, we architect systems that automate complex business processes and drive bottom-line growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-teal italic">Scale-Ready Architecture</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                We don't build MVPs; we build production-ready systems. Our India-based engineering team ensures every line of code is optimized for the next 1 million users.
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-teal italic">Fixed-Price Delivery</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Tired of fluctuating agency bills? We provide definitive fixed-price quotes with clear milestones, ensuring zero budget surprises for your enterprise.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Our Vertical Specializations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-teal/50 hover:bg-teal/5 transition-all text-center"
              >
                <span className="font-semibold group-hover:text-teal transition-colors block">{service.title}</span>
              </Link>
            ))}
          </div>

          <div className="relative p-12 rounded-[4rem] bg-black border border-white/10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-transparent opacity-50" />
            
            <h3 className="relative z-10 text-3xl font-black mb-6">Ready to scale your Indian business?</h3>
            <p className="relative z-10 text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Skip the middleman. Directly discuss your architecture with our lead engineers and get a professional quote within 48 hours.
            </p>
            <div className="relative z-10">
              <Button
                label="Get Indian Quote"
                href="/contact"
                variant="primary"
                size="large"
                trackingSource="india_page_cta"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
