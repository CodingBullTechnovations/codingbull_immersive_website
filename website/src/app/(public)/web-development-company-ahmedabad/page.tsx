import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { generatePageMetadata } from '@/lib/seo';
import { JsonLd, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { siteConfig } from '@/content/site';

const pageUrl = `${siteConfig.baseUrl}/web-development-company-ahmedabad`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Web Development Company in Ahmedabad',
  description:
    'CodingBull builds SEO-ready business websites and lead-generation websites for Ahmedabad companies with proper structure, contact flows, WhatsApp CTA, analytics readiness, and maintainable code.',
  keywords: [
    'web development company Ahmedabad',
    'website development company Ahmedabad',
    'business website development Ahmedabad',
    'SEO-ready website development Ahmedabad',
    'responsive website development Ahmedabad',
    'website redesign Ahmedabad',
  ],
  canonical: pageUrl,
});

const websiteTypes = [
  'Business websites for service companies, clinics, manufacturers, consultants, and B2B teams',
  'Lead-generation websites with clear service pages, inquiry forms, WhatsApp CTA, and conversion tracking readiness',
  'SEO-ready website development Ahmedabad businesses can use as a long-term organic discovery foundation',
  'Website redesign Ahmedabad projects where the current site looks dated, loads slowly, or does not convert visitors',
  'Landing pages for focused services, local search intent, campaigns, and buyer questions',
  'Websites that can later connect to CRM, dashboards, admin panels, booking flows, or custom software',
];

const includedItems = [
  'Clear page structure, readable service copy, and local business positioning',
  'Responsive website development Ahmedabad users can access on mobile, tablet, and desktop',
  'Contact form, WhatsApp flow, clickable CTAs, and source-page tracking readiness',
  'Metadata, canonical URLs, sitemap inclusion, and Search Console readiness',
  'Maintainable Next.js code instead of a fragile one-off template stack',
  'Performance basics such as optimized images, server-rendered content, and stable layout',
];

const technicalFoundation = [
  'Server-rendered public pages for important content',
  'Self-canonical metadata and sitemap-ready final URLs',
  'Responsive layouts that keep CTAs usable on mobile',
  'Analytics and inquiry-source readiness for lead generation',
  'Search Console readiness after launch',
  'A codebase that can grow into CRM, admin panels, or custom workflows',
];

const startingScopes = [
  'A focused business website usually starts with home, services, about, case-study/proof, contact, WhatsApp CTA, and sitemap-ready metadata.',
  'A lead-generation website usually adds service landing pages, direct-answer sections, FAQs, stronger internal linking, and conversion tracking readiness.',
  'A website redesign usually starts with content audit, page mapping, redirect decisions, metadata cleanup, and a sharper inquiry flow.',
  'A website plus business system usually starts with the public website first, then connects CRM, admin, booking, or dashboard workflows after the lead flow is stable.',
];

const faqs = [
  {
    question: 'Is CodingBull a web development company Ahmedabad businesses can hire?',
    answer:
      'Yes. CodingBull builds business websites, lead-generation websites, and maintainable web applications for Ahmedabad companies that need SEO-ready structure, WhatsApp/contact flows, analytics readiness, and clean code.',
  },
  {
    question: 'Do you build SEO-ready business websites in Ahmedabad?',
    answer:
      'Yes. CodingBull builds SEO-ready website development Ahmedabad businesses can use with clean metadata, crawlable content, sitemap inclusion, responsive design, and Search Console readiness.',
  },
  {
    question: 'Can CodingBull redesign an existing Ahmedabad business website?',
    answer:
      'Yes. Website redesign Ahmedabad projects usually start with current-page audit, content structure, lead capture flow, redirects, metadata, and a practical rebuild plan.',
  },
  {
    question: 'Can a website later connect to CRM, HRMS, e-commerce, or custom software?',
    answer:
      'Yes. CodingBull often starts with the public website and then connects CRM, admin panels, dashboards, booking flows, e-commerce, HRMS, or other custom software modules when the business needs them.',
  },
];

export default function WebDevelopmentCompanyAhmedabadPage() {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Ahmedabad', url: `${siteConfig.baseUrl}/ahmedabad` },
        { name: 'Web Development Company in Ahmedabad', url: pageUrl },
      ])} />
      <JsonLd data={generateFAQSchema(faqs)} />

      <PageHero
        title="Web Development Company in Ahmedabad"
        subtitle="CodingBull builds SEO-ready business websites and lead-generation websites for Ahmedabad companies, with proper structure, contact flows, WhatsApp CTA, analytics readiness, and maintainable code."
        badge="Ahmedabad Web Development"
        accentColor="sky"
      />

      <SectionWrapper className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Business website development in Ahmedabad</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Websites built for inquiries, not only a digital brochure.</h2>
            <p className="mt-5 text-base leading-7 text-white/60">
              CodingBull is a website development company Ahmedabad businesses can use when they need a site that explains services clearly, routes buyers to WhatsApp or contact, and leaves room for CRM, dashboards, e-commerce, HRMS, or custom software later.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button label="Discuss Website Scope" href="#whatsapp" icon="whatsapp" variant="primary" trackingSource="ahmedabad_web_page_whatsapp" />
              <Button label="Contact CodingBull" href="/contact" variant="secondary" trackingSource="ahmedabad_web_page_contact" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {websiteTypes.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                <p className="mt-3 text-sm leading-6 text-white/65">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">What is included</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">The foundation a lead-generation website needs.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {includedItems.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-6 text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Why not just a template website</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Templates rarely understand the sales path.</h2>
            <p className="mt-5 text-sm leading-6 text-white/60">
              A template can look complete while still missing buyer intent, service hierarchy, local search terms, conversion flow, and maintainable code. CodingBull builds business website development Ahmedabad companies can extend into stronger landing pages, CRM, dashboards, booking, or automation when the business grows.
            </p>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Website plus lead capture</p>
            <h2 className="mt-4 text-2xl font-bold text-white">Contact, WhatsApp, and source-page readiness.</h2>
            <p className="mt-5 text-sm leading-6 text-white/60">
              A lead-generation website should make it easy for a visitor to ask for scope. CodingBull connects clear CTAs, WhatsApp entry points, contact forms, and analytics/source readiness so Ahmedabad businesses can see which pages create inquiries.
            </p>
          </article>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Technical foundation</p>
              <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Performance, SEO basics, responsive design, and Search Console readiness.</h2>
              <p className="mt-5 text-sm leading-6 text-white/60">
                Good web development is not only visual polish. The site should be crawlable, responsive, maintainable, and ready for the basic search and lead-generation systems a growing Ahmedabad business needs.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {technicalFoundation.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Typical starting-scope guidance</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Start with the site structure that can generate and qualify leads.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {startingScopes.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/60">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold text-white">Need custom software beyond the website?</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">
              If the website needs to connect with admin panels, CRM, HRMS, e-commerce, healthcare management, dashboards, or workflow automation, review CodingBull as a custom software development company in Ahmedabad.
            </p>
            <Link href="/software-development-company-ahmedabad" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-white">
              View software development page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">FAQs</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Web development questions from Ahmedabad businesses.</h2>
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
