import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/Button';
import { ContactForm } from '@/components/sections/ContactForm';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import { RelatedLinksRail } from '@/components/sections/RelatedLinksRail';
import { primaryEntryPoints } from '@/content/link-graph';
import { siteConfig } from '@/content/site';
import { JsonLd, generateBreadcrumbSchema, generateContactPageSchema } from '@/lib/schema';
import { TrackedContactLink } from '@/components/ui/TrackedContactLink';

export const metadata = generatePageMetadata(pageMetadata.contact);

export default function ContactPage() {
  const pageUrl = `${siteConfig.baseUrl}/contact`;

  return (
    <>
      <JsonLd data={generateContactPageSchema({
        name: 'Contact CodingBull Technovations',
        description: 'Share a custom software requirement with CodingBull for founder-led scope review.',
        url: pageUrl,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Contact CodingBull', url: pageUrl },
      ])} />
      <PageHero
        title="Start with the workflow."
        subtitle="Speak directly with the founder about the users, decisions, exceptions, integrations, and business outcome your system needs to support."
        badge="Project contact"
      />

      <section className="cb-section bg-[#05070a]">
        <div className="cb-shell grid gap-14 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="cb-kicker">Fastest route</p>
            <h2 className="mt-6 max-w-[12ch] font-[family-name:var(--font-display)] text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl">Discuss feasibility on WhatsApp.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/52 sm:text-base">Best for an initial fit check, a quick scope conversation, or deciding whether a custom build is the right approach.</p>
            <div className="mt-8">
              <Button label="Chat with Pranshu" href="#whatsapp" variant="primary" icon="whatsapp" trackingSource="contact_page_whatsapp" size="large" />
            </div>

            <div className="mt-12 border-t border-white/10 pt-7 text-sm leading-7 text-white/46">
              <p className="font-mono text-xs uppercase tracking-[0.17em] text-[var(--accent-soft)]">Company entity</p>
              <p className="mt-4 text-white/70">CodingBull Technovations Pvt. Ltd.</p>
              <p>Ahmedabad, Gujarat, India</p>
              <p>GSTIN 24AAMCC7617E1ZP</p>
              <p className="mt-4">Serving India, USA, UAE, and Canada through founder-led remote delivery.</p>
              <div className="mt-5 flex flex-col gap-1 text-white/65">
                <TrackedContactLink href={`mailto:${siteConfig.email}`} source="contact_page_email" className="hover:text-white">{siteConfig.email}</TrackedContactLink>
                <TrackedContactLink href={`tel:${siteConfig.phone.replaceAll(' ', '')}`} source="contact_page_phone" className="hover:text-white">{siteConfig.phone}</TrackedContactLink>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-9 border-b border-white/10 pb-8">
              <p className="cb-kicker">Formal project brief</p>
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">Request an architecture review.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">Provide enough operating context for a focused technical review and fixed-price scope discussion.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <RelatedLinksRail
        kicker="Before you write"
        title="Scope, proof, and process in one place."
        links={primaryEntryPoints}
      />
    </>
  );
}
