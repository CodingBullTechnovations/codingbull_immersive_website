import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/sections/ContactForm';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(pageMetadata.contact);

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Direct Architect Access"
        subtitle="Discuss your enterprise requirements directly with our technical founders. WhatsApp for speed, or use the formal inquiry system below."
        badge="Get In Touch"
        accentColor="sky"
      />

      <SectionWrapper className="py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* WhatsApp CTA */}
          <div className="text-center mb-24">
            <p className="text-white/60 text-[11px] uppercase tracking-widest font-semibold mb-8">Fastest Architecture Scoping</p>
            <Button
              label="Chat on WhatsApp"
              href="#whatsapp"
              variant="primary"
              icon="whatsapp"
              trackingSource="contact_page_whatsapp"
              size="large"
              className="shadow-[0_0_50px_-10px_rgba(20,184,166,0.4)]"
            />
            <p className="mt-8 text-white/60 text-sm font-light max-w-sm mx-auto leading-relaxed">
              Skip the backlog. Directly discuss technical feasibility and get a ballpark quote via WhatsApp.
            </p>
          </div>

          {/* Formal Form */}
          <div className="mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Initialize Project Inquiry</h2>
              <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                Provide your requirements below for a detailed technical review and fixed-price quotation.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-10 bg-white/[0.02] rounded-[2rem] border border-white/[0.05] hover:border-sky-400/20 transition-all duration-300">
              <h3 className="text-[10px] text-sky-400 tracking-[0.3em] uppercase font-bold mb-4">Corporate Info</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                CodingBull Technovations Pvt. Ltd.<br />
                GSTIN: 24AAMCC7617E1ZP<br />
                Ahmedabad, Gujarat, India
              </p>
            </div>
            <div className="p-10 bg-white/[0.02] rounded-[2rem] border border-white/[0.05] hover:border-sky-400/20 transition-all duration-300">
              <h3 className="text-[10px] text-sky-400 tracking-[0.3em] uppercase font-bold mb-4">Coverage</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                India • United States • UAE<br />
                Bespoke Remote Engineering<br />
                Verified 24/7 Uptime
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
