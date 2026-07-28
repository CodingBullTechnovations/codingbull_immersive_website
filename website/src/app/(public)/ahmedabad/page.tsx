import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateLocalBusinessSchema } from '@/lib/schema';
import { getPublicSocialLinksConfig } from '@/lib/server/social-links';
import { sameAsSocialUrls } from '@/lib/social-links';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { services } from '@/content/services';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { RelatedLinksRail } from '@/components/sections/RelatedLinksRail';
import { ahmedabadSiblings } from '@/content/link-graph';

export const metadata: Metadata = generatePageMetadata(pageMetadata.ahmedabad);

const leadPages = [
  {
    title: 'Software Development Company in Ahmedabad',
    href: '/software-development-company-ahmedabad',
    description: 'Custom software, CRM, HRMS, e-commerce, healthcare systems, admin panels, dashboards, and workflow automation for Ahmedabad businesses.',
  },
  {
    title: 'Web Development Company in Ahmedabad',
    href: '/web-development-company-ahmedabad',
    description: 'SEO-ready business websites, lead-generation websites, WhatsApp/contact flows, responsive pages, and maintainable code.',
  },
];

const localServiceLinks = [
  { title: 'All services', href: '/services', description: 'Review CodingBull service areas before requesting scope.' },
  { title: 'Healthcare software', href: '/services/healthcare-software-development', description: 'Clinic management, appointment booking, patient records, billing, and follow-ups.' },
  { title: 'Clinic management software', href: '/services/clinic-management-software-development', description: 'Appointment booking, patient records, doctor schedules, follow-ups, billing workflow, and clinic dashboards.' },
  { title: 'Hospital management software', href: '/services/hospital-management-software-development', description: 'Patient registration, hospital workflows, departments, roles, billing, reporting, and audit-ready operations.' },
  { title: 'E-commerce development', href: '/services/ecommerce-development', description: 'SEO-first storefronts, inventory/order automation, payments, and backend operations.' },
  { title: 'Inventory and order management', href: '/services/inventory-order-management-software', description: 'Product, SKU, stock tracking, order workflow, payment and shipping readiness, reports, and admin dashboards.' },
  { title: 'HRMS and payroll', href: '/services/custom-hrms-payroll-software', description: 'Attendance, leave, payroll workflows, payslips, and workforce dashboards.' },
  { title: 'Attendance and payroll management', href: '/services/attendance-payroll-management-software', description: 'Attendance capture, leave, shift rules, payroll workflow, approvals, reports, and HRMS readiness.' },
  { title: 'Custom business systems', href: '/services/custom-business-systems', description: 'Internal CRM, admin panels, approval portals, reporting, dashboards, and workflow automation.' },
  { title: 'Custom CRM development', href: '/services/custom-crm-development', description: 'Lead tracking, customer records, follow-ups, roles, dashboards, and workflow automation.' },
  { title: 'Case studies', href: '/case-studies', description: 'Review proof from healthcare, lead-generation, and operations-focused builds.' },
];

export default async function AhmedabadPage() {
  const socialConfig = await getPublicSocialLinksConfig();

  return (
    <>
      <JsonLd data={generateLocalBusinessSchema({
        name: 'CodingBull Technovations Ahmedabad',
        city: 'Ahmedabad',
        region: 'Gujarat',
        country: 'India',
        sameAs: sameAsSocialUrls(socialConfig),
      })} />
      <PageHero
        title="CodingBull Ahmedabad"
        subtitle="Local company information, service coverage, project proof, and the direct routes for Ahmedabad businesses comparing custom software or website partners."
        badge="Local Company Hub"
      />

      <SectionWrapper className="py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">An Ahmedabad-based, founder-led software company</h2>
          <p className="text-white/60 text-lg mb-10 max-w-4xl">
            CodingBull Technovations Pvt. Ltd. is based in Ahmedabad and builds practical digital systems for businesses that need more than a brochure site or generic SaaS subscription. We scope the workflow first, then build the website, CRM, HRMS, admin panel, dashboard, e-commerce, healthcare, or custom software around how the team actually works.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-bold mb-4 text-teal">Local Expertise</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Ahmedabad companies often need clear scope, fast communication, WhatsApp-led inquiry flow, practical admin tools, and software that fits Indian operating realities.
              </p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h3 className="text-xl font-bold mb-4 text-teal">Global Standards</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Our code and architecture follow established engineering practices, with maintainable foundations that can support staged growth as requirements become clear.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Ahmedabad Lead-Generation Pages</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-16">
            {leadPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-teal/40 hover:bg-teal/[0.04]"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Local buyer page</span>
                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-teal">{page.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{page.description}</p>
              </Link>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-6">Core Services for Ahmedabad Businesses</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-16">
            {localServiceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-teal/50 hover:bg-teal/5 group"
              >
                <span className="font-semibold group-hover:text-teal transition-colors">{link.title}</span>
                <p className="mt-2 text-sm leading-6 text-white/45">{link.description}</p>
              </Link>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-6">Existing Service Pages</h3>
          <div className="flex flex-wrap gap-4 mb-24">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="border border-white/10 bg-white/[0.02] px-6 py-4 transition-colors hover:border-teal/50 hover:bg-teal/5 group"
              >
                <span className="font-semibold group-hover:text-teal transition-colors">{service.title}</span>
              </Link>
            ))}
          </div>

          <div className="border border-teal/25 bg-teal/[0.05] p-12 text-center">
            <h3 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em]">Ready to build your system in Ahmedabad?</h3>
            <p className="text-white/60 mb-10 max-w-lg mx-auto">
              Share the website, CRM, HRMS, e-commerce, healthcare software, admin panel, dashboard, or workflow automation you need. CodingBull will respond with a practical starting scope for your Ahmedabad business.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                label="Discuss on WhatsApp"
                href="#whatsapp"
                icon="whatsapp"
                variant="primary"
                size="large"
                trackingSource="ahmedabad_page_whatsapp"
              />
              <Button
                label="Contact CodingBull"
                href="/contact"
                variant="secondary"
                size="large"
                trackingSource="ahmedabad_page_contact"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
      <RelatedLinksRail
        kicker="Ahmedabad"
        title="More for Ahmedabad buyers."
        links={ahmedabadSiblings('/ahmedabad')}
        intro="Related local pages covering the same delivery capability from a different buying intent."
      />
    </>
  );
}
