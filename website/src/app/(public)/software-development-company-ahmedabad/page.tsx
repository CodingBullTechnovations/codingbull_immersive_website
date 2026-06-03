import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { siteConfig } from '@/content/site';

const pageUrl = `${siteConfig.baseUrl}/software-development-company-ahmedabad`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Software Development Company in Ahmedabad',
  description:
    'CodingBull Technovations is a custom software development company in Ahmedabad building business websites, admin panels, CRM, HRMS, e-commerce systems, healthcare software, dashboards, and workflow automation.',
  keywords: [
    'software development company in Ahmedabad',
    'custom software development company in Ahmedabad',
    'software developers Ahmedabad',
    'business software development Ahmedabad',
    'admin panel development Ahmedabad',
    'CRM development Ahmedabad',
    'HRMS software development Ahmedabad',
    'healthcare software development Ahmedabad',
    'ecommerce development Ahmedabad',
  ],
  canonical: pageUrl,
});

const softwareTypes = [
  'Business websites and lead-generation websites',
  'Admin panels, dashboards, and reporting systems',
  'CRM development Ahmedabad businesses can adapt to their sales process',
  'HRMS software development Ahmedabad teams can use for attendance, leave, payroll, and approvals',
  'E-commerce platforms, inventory workflows, and order automation',
  'Healthcare software development Ahmedabad clinics can use for appointments, records, billing, and follow-ups',
];

const servicesForAhmedabad = [
  {
    title: 'Custom software development',
    href: '/services/custom-business-systems',
    description: 'Workflow portals, internal CRM, approval systems, customer portals, reporting dashboards, and automation around your operating model.',
  },
  {
    title: 'Custom CRM development',
    href: '/services/custom-crm-development',
    description: 'Lead tracking, customer management, follow-ups, role-based access, dashboards, and workflow CRM development.',
  },
  {
    title: 'Healthcare software',
    href: '/services/healthcare-software-development',
    description: 'Clinic management software, appointment booking, patient intake, branch scheduling, billing, follow-up reminders, and admin dashboards.',
  },
  {
    title: 'Clinic management software',
    href: '/services/clinic-management-software-development',
    description: 'Appointments, patient records, doctor or therapist schedules, follow-ups, billing workflow, roles, and clinic dashboards.',
  },
  {
    title: 'Hospital management software',
    href: '/services/hospital-management-software-development',
    description: 'Patient registration, hospital workflows, departments, roles, billing, reporting, audit logs, and integration-ready architecture.',
  },
  {
    title: 'E-commerce systems',
    href: '/services/ecommerce-development',
    description: 'SEO-ready storefronts, product control, inventory/order automation, payment flow, fulfillment visibility, and backend operations.',
  },
  {
    title: 'Inventory and order management',
    href: '/services/inventory-order-management-software',
    description: 'Product and SKU management, stock tracking, order states, payment and shipping readiness, reports, and admin dashboards.',
  },
  {
    title: 'HRMS and payroll',
    href: '/services/custom-hrms-payroll-software',
    description: 'Attendance rules, salary workflows, leave policies, payslips, employee records, approvals, and workforce dashboards.',
  },
  {
    title: 'Attendance and payroll management',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave, shift rules, payroll workflow, multi-location teams, approvals, reports, and HRMS readiness.',
  },
];

const industries = [
  'Clinics, diagnostics, hospitals, and healthcare operators',
  'Retail, D2C, B2B commerce, and inventory-led businesses',
  'Service companies that need CRM, dashboards, portals, or workflow automation',
  'Manufacturing, industrial, and operations-heavy companies',
  'Growing teams that need HRMS, payroll, attendance, and approval systems',
];

const process = [
  'Understand the real workflow, users, approvals, reporting needs, and business outcome.',
  'Convert the workflow into modules, screens, data model, integrations, and acceptance criteria.',
  'Share a fixed-scope build plan with milestones, assumptions, and clear ownership.',
  'Build, review, launch, and support the system without forcing the business into generic SaaS behavior.',
];

const projectTypes = [
  'A focused business website or landing site can start with pages, inquiry flow, WhatsApp CTA, analytics readiness, and SEO basics.',
  'An admin panel or CRM usually starts with users, roles, lead/customer records, status flow, notes, reminders, and reporting.',
  'An HRMS or attendance system usually starts with employees, branches, shifts, leave rules, approvals, payroll review, and payslips.',
  'An e-commerce or inventory system usually starts with catalog, stock movement, orders, payment state, fulfillment, and owner dashboards.',
  'A healthcare system usually starts with appointments, patient records, staff roles, billing, follow-ups, and branch-wise reporting.',
];

const faqs = [
  {
    question: 'Is CodingBull a software development company in Ahmedabad?',
    answer:
      'Yes. CodingBull Technovations Pvt. Ltd. is based in Ahmedabad and builds custom software, business websites, admin panels, CRM, HRMS, e-commerce systems, healthcare software, dashboards, and workflow automation.',
  },
  {
    question: 'Do you build custom business software for Ahmedabad companies?',
    answer:
      'Yes. CodingBull builds custom business software development Ahmedabad companies can use for internal CRM, admin panels, workflow automation, reporting, approvals, and operations management.',
  },
  {
    question: 'Can you build clinic management software in Ahmedabad?',
    answer:
      'Yes. CodingBull builds clinic management software Ahmedabad healthcare teams can use for appointment booking, patient records, branch schedules, billing, reminders, and management dashboards.',
  },
  {
    question: 'Do you provide CRM and HRMS software development in Ahmedabad?',
    answer:
      'Yes. CodingBull builds CRM development Ahmedabad teams can adapt to their sales process, and HRMS software development Ahmedabad companies can use for attendance, payroll, leave, approvals, and employee records.',
  },
];

export default function SoftwareDevelopmentCompanyAhmedabadPage() {
  const relevantCaseStudies = caseStudies.filter((study) => ['physioway', 'shashwat-ivf', 'anr-mechanical'].includes(study.slug));

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Ahmedabad', url: `${siteConfig.baseUrl}/ahmedabad` },
        { name: 'Software Development Company in Ahmedabad', url: pageUrl },
      ])} />
      <JsonLd data={generateFAQSchema(faqs)} />

      <PageHero
        title="Software Development Company in Ahmedabad"
        subtitle="CodingBull Technovations Pvt. Ltd. is a custom software development company in Ahmedabad building business websites, admin panels, CRM, HRMS, e-commerce systems, healthcare software, dashboards, and workflow automation."
        badge="Ahmedabad Software Development"
        accentColor="teal"
      />

      <SectionWrapper className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">What software we build</p>
              <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Custom systems for Ahmedabad businesses that need operational control.</h2>
              <p className="mt-5 text-base leading-7 text-white/60">
                CodingBull works with business owners and operators who need software developers Ahmedabad teams can reach directly, clear scope before development starts, and software shaped around daily work instead of generic templates.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {softwareTypes.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <CheckCircle2 className="h-4 w-4 text-teal" />
                  <p className="mt-3 text-sm leading-6 text-white/65">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Services for Ahmedabad businesses</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Focused software services linked to real business workflows.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {servicesForAhmedabad.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-teal">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{service.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-teal" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Industries we serve</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Ahmedabad use cases we understand.</h2>
            <ul className="mt-6 space-y-3">
              {industries.map((industry) => (
                <li key={industry} className="flex items-start gap-3 text-sm leading-6 text-white/60">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" />
                  <span>{industry}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Why Ahmedabad businesses choose CodingBull</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Direct scoping before development starts.</h2>
            <p className="mt-5 text-sm leading-6 text-white/60">
              Ahmedabad businesses choose CodingBull when they need a custom software development company in Ahmedabad that can discuss workflow, admin roles, reports, data, integrations, and launch ownership without turning every request into a vague hourly estimate.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button label="Discuss on WhatsApp" href="#whatsapp" icon="whatsapp" variant="primary" trackingSource="ahmedabad_software_page_whatsapp" />
              <Button label="Contact CodingBull" href="/contact" variant="secondary" trackingSource="ahmedabad_software_page_contact" />
            </div>
          </article>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Our development process</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">From workflow discovery to launch support.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {process.map((step, index) => (
              <div key={step} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-xs font-bold text-teal">0{index + 1}</span>
                <p className="mt-4 text-sm leading-6 text-white/60">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Typical project types</p>
              <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Starting-scope guidance before a proposal.</h2>
              <p className="mt-5 text-sm leading-6 text-white/60">
                Every project starts with the smallest reliable operating loop. That keeps business software development Ahmedabad projects practical, measurable, and easier to launch.
              </p>
            </div>
            <div className="space-y-3">
              {projectTypes.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Relevant case-study links</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Proof from healthcare, operations, and business systems.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {relevantCaseStudies.map((study) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`} className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">{study.category}</p>
                <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-teal">{study.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/55">{study.challenge}</p>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">FAQs</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Software development questions from Ahmedabad buyers.</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
