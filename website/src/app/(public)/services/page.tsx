import { PageHero } from '@/components/sections/PageHero';
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
  if (slug.includes('ecommerce')) return 'E-COMMERCE';
  if (slug.includes('hrms') || slug.includes('payroll')) return 'ENTERPRISE HRMS';
  return 'CUSTOM SYSTEMS';
}

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

  return (
    <>
      <PageHero
        title="Enterprise Software Services"
        subtitle="We engineer proprietary digital systems that scale. From healthcare scheduling to e-commerce architecture — each solution is custom-built around your specific operational workflow."
        badge="Our Expertise"
        accentColor="teal"
      />

      <div className="relative z-10 -mt-12 lg:-mt-20">
        <WhatWeBuildSection niches={visibleNiches} />
      </div>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
