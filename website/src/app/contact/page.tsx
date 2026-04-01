import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Contact Us | CodingBull Technovations',
  description: 'Skip the forms — contact our architectural team directly via WhatsApp for swift, fixed-price project quotes.',
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Direct Architect Access"
        subtitle="We don't use generic contact forms. Get immediate, direct communication with our senior development team to discuss your enterprise requirements."
        badge="Get In Touch"
        accentColor="sky"
      />

      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* WhatsApp CTA */}
          <div className="text-center mb-16">
            <p className="text-white/40 text-[13px] uppercase tracking-widest font-semibold mb-6">Preferred Method</p>
            <Button
              label="Chat on WhatsApp"
              href="#whatsapp"
              variant="primary"
              icon="whatsapp"
              trackingSource="contact_page_whatsapp"
              size="large"
              className="shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]"
            />
            <p className="mt-6 text-white/40 text-sm font-light max-w-md mx-auto leading-relaxed">
              Most of our clients bypass traditional emails to get faster architectural scoping and fixed-price quotes.
            </p>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-sky-400/20 transition-colors duration-300">
              <h3 className="text-[11px] text-sky-400 tracking-[0.2em] uppercase font-bold mb-4">Company Details</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                CodingBull Technovations Pvt. Ltd.<br />
                GSTIN: 24AAMCC7617E1ZP<br />
                Ahmedabad, Gujarat, India
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-sky-400/20 transition-colors duration-300">
              <h3 className="text-[11px] text-sky-400 tracking-[0.2em] uppercase font-bold mb-4">Service Regions</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                India • United States • UAE<br />
                Remote-first, global delivery<br />
                Response within 24 hours
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-sky-400/20 transition-colors duration-300">
              <h3 className="text-[11px] text-sky-400 tracking-[0.2em] uppercase font-bold mb-4">Email</h3>
              <p className="text-white/60 text-sm font-light">
                contact@codingbullz.com
              </p>
            </div>
            <div className="p-8 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-sky-400/20 transition-colors duration-300">
              <h3 className="text-[11px] text-sky-400 tracking-[0.2em] uppercase font-bold mb-4">Working Hours</h3>
              <p className="text-white/60 text-sm font-light">
                Mon — Sat: 10 AM – 7 PM IST<br />
                WhatsApp: Always available
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
