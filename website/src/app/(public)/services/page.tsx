import { PageHero } from '@/components/sections/PageHero';
import Link from 'next/link';
import { WhatWeBuildSection } from '@/components/sections/WhatWeBuildSection';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { services } from '@/content/services';
import { generatePageMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';
import { getPublishedServiceBySlug, listServiceSlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

export const revalidate = 60;

export const metadata = generatePageMetadata({
  title: 'Enterprise Services & Solutions',
  description: 'Explore CodingBull software development services for healthcare systems, e-commerce platforms, HRMS/payroll, and custom business systems.',
  canonical: `${siteConfig.baseUrl}/services`,
});

function serviceChipsFromModules(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item !== 'object' || item === null) return '';
      return String((item as Record<string, unknown>).title ?? '').trim();
    })
    .filter(Boolean)
    .slice(0, 3);
}

function fallbackVerticalId(slug: string) {
  if (slug.includes('healthcare')) return 'HEALTHCARE';
  if (slug.includes('clinic') || slug.includes('hospital')) return 'HEALTHCARE';
  if (slug.includes('ecommerce')) return 'E-COMMERCE';
  if (slug.includes('inventory') || slug.includes('order')) return 'E-COMMERCE';
  if (slug.includes('hrms') || slug.includes('payroll')) return 'ENTERPRISE HRMS';
  return 'CUSTOM SYSTEMS';
}

const CORE_SERVICE_PATHS = new Set([
  '/services/healthcare-software-development',
  '/services/ecommerce-development',
  '/services/custom-hrms-payroll-software',
  '/services/custom-business-systems',
]);

const leadServicePages = [
  {
    title: 'Custom CRM Development',
    href: '/services/custom-crm-development',
    description: 'Lead tracking, customer records, follow-ups, roles, dashboards, and workflow CRM development.',
  },
  {
    title: 'Clinic Management Software',
    href: '/services/clinic-management-software-development',
    description: 'Appointments, patient records, doctor or therapist schedules, follow-ups, billing workflow, and clinic dashboards.',
  },
  {
    title: 'Hospital Management Software',
    href: '/services/hospital-management-software-development',
    description: 'Patient registration, hospital workflows, departments, roles, billing, reporting, audit logs, and integration-ready architecture.',
  },
  {
    title: 'Inventory and Order Management',
    href: '/services/inventory-order-management-software',
    description: 'Products, SKUs, stock tracking, order states, payment and shipping readiness, reports, and admin dashboards.',
  },
  {
    title: 'Attendance and Payroll Management',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave, shift rules, payroll workflow, multi-location teams, approvals, reports, and HRMS readiness.',
  },
];

export default async function ServicesPage() {
  const dbStatuses = await listServiceSlugStatuses();
  const dbStatusBySlug = new Map(dbStatuses.map((item) => [item.slug, item.status]));
  const dbPublishedServices = await Promise.all(
    dbStatuses
      .filter((item) => item.status === ContentStatus.PUBLISHED)
      .map((item) => getPublishedServiceBySlug(item.slug)),
  );
  const dbNiches = dbPublishedServices.flatMap((service) => {
    if (!service) return [];
    const hero = typeof service.hero === 'object' && service.hero !== null ? service.hero as Record<string, unknown> : {};
    const chips = serviceChipsFromModules(service.modules);

    return [{
      verticalId: fallbackVerticalId(service.slug),
      title: service.title,
      subtitle: service.metaDescription || String(hero.summary ?? ''),
      chips: chips.length > 0 ? chips : ['Workflow Design', 'Admin Systems', 'Reporting'],
      href: `/services/${service.slug}`,
    }];
  });
  const staticNiches = services
    .filter((service) => !dbStatusBySlug.has(service.slug))
    .map((service) => ({
      verticalId: fallbackVerticalId(service.slug),
      title: service.title,
      subtitle: service.description,
      chips: service.features.slice(0, 3).map((feature) => feature.title),
      href: `/services/${service.slug}`,
    }));
  const visibleNiches = [...dbNiches, ...staticNiches];
  const coreNiches = visibleNiches.filter((niche) => CORE_SERVICE_PATHS.has(niche.href));

  return (
    <>
      <PageHero
        title="Enterprise Software Services"
        subtitle="We engineer proprietary digital systems that scale. From healthcare scheduling to e-commerce architecture — each solution is custom-built around your specific operational workflow."
        badge="Our Expertise"
        accentColor="teal"
      />

      <div className="relative z-10 -mt-12 lg:-mt-20">
        <WhatWeBuildSection niches={coreNiches.length > 0 ? coreNiches : visibleNiches} />
      </div>

      <section className="relative z-10 border-y border-white/[0.05] bg-black/30 py-16">
        <div className="mx-auto max-w-[var(--max-w-content)] px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">Ahmedabad service paths</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-outfit)]">
                Local software and website development pages.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/50">
                For Ahmedabad buyers comparing vendors, these pages explain CodingBull&apos;s custom software and business website development scope in local search language.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'Software Development Company in Ahmedabad',
                  href: '/software-development-company-ahmedabad',
                  description: 'Custom software, CRM, HRMS, admin panels, e-commerce, healthcare software, dashboards, and automation.',
                },
                {
                  title: 'Web Development Company in Ahmedabad',
                  href: '/web-development-company-ahmedabad',
                  description: 'SEO-ready business websites, responsive pages, lead capture, WhatsApp flow, and maintainable code.',
                },
              ].map((page) => (
                <Link key={page.href} href={page.href} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]">
                  <h3 className="text-lg font-semibold text-white">{page.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/[0.05] bg-[#050508] py-16">
        <div className="mx-auto max-w-[var(--max-w-content)] px-6 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">Focused service pages</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-outfit)]">
              Lead-generation services with clearer buyer intent.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              These pages cover common Ahmedabad, India, USA, Canada, and UAE searches for CRM, clinic, hospital, inventory, order, attendance, payroll, and HRMS software.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leadServicePages.map((page) => (
              <Link key={page.href} href={page.href} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]">
                <h3 className="text-lg font-semibold text-white">{page.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
