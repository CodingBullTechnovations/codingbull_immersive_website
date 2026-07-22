import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { MarkdownContent, parseMarkdownToBlocks } from '@/components/sections/MarkdownContent';
import { homeContent } from '@/content/home';
import { caseStudies } from '@/content/case-studies';
import { insights } from '@/content/insights';
import { services, servicesBySlug, type ServiceContent } from '@/content/services';
import { siteConfig } from '@/content/site';
import { serviceRelatedLinks } from '@/content/link-graph';
import { generatePageMetadata } from '@/lib/seo';
import { getIndustryForPath, industryLabels } from '@/lib/industry';
import { JsonLd, generateBreadcrumbSchema, generateFAQSchema, generateServiceSchema } from '@/lib/schema';
import {
  getServiceBySlug,
  isCaseStudyPubliclyVisible,
  listInsightSlugStatuses,
  listServiceSlugStatuses,
  listVisibleCaseStudyStatuses,
} from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

type ServiceViewContent = ServiceContent & {
  faqs?: Array<{ question: string; answer: string }>;
  body?: string;
};

export async function generateStaticParams() {
  const dbServices = await listServiceSlugStatuses();
  const dbStatusBySlug = new Map(dbServices.map((item) => [item.slug, item.status]));
  const slugs = new Set([
    ...dbServices.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...services.filter((item) => !dbStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);
  return Array.from(slugs).map((service) => ({ service }));
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function objectArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null))
        .filter((item): item is Record<string, unknown> => Boolean(item))
    : [];
}

function mapDbService(service: Awaited<ReturnType<typeof getServiceBySlug>>): ServiceViewContent | null {
  if (!service) return null;

  const hero = typeof service.hero === 'object' && service.hero !== null ? (service.hero as Record<string, unknown>) : {};
  const modules = objectArray(service.modules);
  const faqs = objectArray(service.faqs);

  return {
    slug: service.slug,
    title: service.title,
    description: service.metaDescription || String(hero.summary ?? ''),
    accentColor: 'teal',
    painPoints: stringArray(service.painPoints),
    solution: String(hero.summary ?? service.metaDescription ?? ''),
    body: service.body ?? undefined,
    features: modules.map((module) => ({
      title: String(module.title ?? ''),
      description: String(module.description ?? ''),
    })),
    // DB records carry no stack field yet — fall back to the static content
    // so migrated services keep their published technology list.
    techStack: servicesBySlug[service.slug]?.techStack ?? [],
    faqs: faqs.map((faq) => ({
      question: String(faq.question ?? ''),
      answer: String(faq.answer ?? ''),
    })),
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const dbService = await getServiceBySlug(service);
  const data = dbService
    ? (dbService.status === ContentStatus.PUBLISHED ? mapDbService(dbService) : null)
    : servicesBySlug[service];
  if (!data) return { title: 'Service Not Found' };

  // Honor an admin-configured canonical path when it is same-origin relative.
  const canonicalPath = dbService?.canonicalPath?.startsWith('/')
    ? dbService.canonicalPath
    : `/services/${service}`;

  return generatePageMetadata({
    title: dbService?.metaTitle || data.title,
    description: dbService?.metaDescription || data.description,
    canonical: `${siteConfig.baseUrl}${canonicalPath}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const dbService = await getServiceBySlug(service);
  const serviceData: ServiceViewContent | undefined = dbService
    ? (dbService.status === ContentStatus.PUBLISHED ? mapDbService(dbService) ?? undefined : undefined)
    : servicesBySlug[service];

  if (!serviceData) {
    notFound();
  }

  const serviceUrl = `${siteConfig.baseUrl}/services/${serviceData.slug}`;
  const faqs = serviceData.faqs ?? [];
  const bodyBlocks = serviceData.body ? parseMarkdownToBlocks(serviceData.body) : [];
  const industry = getIndustryForPath(`/services/${serviceData.slug}`);

  // Cross-links must respect CMS visibility: a slug owned by the CMS but not
  // publicly visible (draft/archived/unapproved) must not be linked to a 404.
  const [caseStudyStatuses, insightStatuses] = await Promise.all([
    listVisibleCaseStudyStatuses(),
    listInsightSlugStatuses(),
  ]);
  const hiddenCaseStudySlugs = new Set(
    caseStudyStatuses.filter((item) => !isCaseStudyPubliclyVisible(item)).map((item) => item.slug),
  );
  const hiddenInsightSlugs = new Set(
    insightStatuses.filter((item) => item.status !== ContentStatus.PUBLISHED).map((item) => item.slug),
  );
  const relatedInsights = insights
    .filter((post) => !hiddenInsightSlugs.has(post.slug) && getIndustryForPath(`/insights/${post.slug}`) === industry)
    .slice(0, 3);
  const relatedCaseStudies = caseStudies
    .filter((study) => !hiddenCaseStudySlugs.has(study.slug) && getIndustryForPath(`/case-studies/${study.slug}`) === industry)
    .slice(0, 2);
  const relatedServiceLinks = serviceRelatedLinks[serviceData.slug] ?? [];

  return (
    <>
      <JsonLd data={generateServiceSchema({
        name: serviceData.title,
        description: serviceData.description,
        url: serviceUrl,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Services', url: `${siteConfig.baseUrl}/services` },
        { name: serviceData.title, url: serviceUrl },
      ])} />
      {faqs.length > 0 && <JsonLd data={generateFAQSchema(faqs)} />}

      <PageHero
        title={serviceData.title}
        subtitle={serviceData.description}
        badge={serviceData.features[0]?.title}
      />

      {/* Pain Points Section */}
      <section className="py-20 lg:py-28 bg-[rgba(10,12,20,0.5)] border-y border-white/[0.05] relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Pain Points */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)] block mb-4">
                The Problem
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight mb-8">
                Challenges You&apos;re <span className="text-teal">Facing</span>
              </h2>
              <div className="flex flex-col gap-4">
                {serviceData.painPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4 border border-white/10 bg-white/[0.02] p-5">
                    <div className="shrink-0 w-8 h-8 border border-white/10 bg-white/[0.03] flex items-center justify-center mt-0.5">
                      <span className="text-[var(--accent-soft)] text-sm font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
                Our Solution
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight mb-8">
                How We <span className="text-teal">Solve It</span>
              </h2>
              <div className="border border-teal/20 bg-teal/[0.04] p-8">
                <p className="text-white/70 text-base lg:text-lg leading-relaxed font-light">
                  {serviceData.solution}
                </p>
              </div>

              {/* Tech Stack */}
              {serviceData.techStack.length > 0 && <div className="mt-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 block mb-3">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {serviceData.techStack.map(tech => (
                    <span key={tech} className="border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/50 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
              Core Capabilities
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              Powerful <span className="text-white">Features</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceData.features.map((feature, idx) => (
              <div
                key={idx}
                className="group border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-teal/25 hover:bg-white/[0.04]"
              >
                <div className="w-12 h-12 border border-teal/20 bg-teal/10 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:bg-teal/20">
                  <div className="h-2 w-2 bg-teal" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-[family-name:var(--font-display)] group-hover:text-teal transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 relative z-10 border-t border-white/[0.05]">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
                Proof and topical depth
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {industryLabels[industry]} proof and guidance
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/50">
                Deployed work and practical writing connected to this service, so you can judge how we handle the exact operating problems it solves.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[...relatedCaseStudies.map((study) => ({
                href: `/case-studies/${study.slug}`,
                label: 'Case study',
                title: study.title,
                description: study.challenge,
              })), ...relatedInsights.map((post) => ({
                href: `/insights/${post.slug}`,
                label: 'Insight',
                title: post.title,
                description: post.excerpt,
              }))].map((item) => (
                <Link key={item.href} href={item.href} className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-teal/25 hover:bg-white/[0.05]">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">{item.label}</span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-20 lg:py-28 relative z-10 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
              Buyer Questions
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight mb-10">
              Direct Answers
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="font-semibold text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {bodyBlocks.length > 0 && (
        <section className="py-20 lg:py-28 relative z-10 border-t border-white/[0.05] bg-[var(--surface-base)]">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
              Service Guide
            </span>
            <MarkdownContent blocks={bodyBlocks} />
          </div>
        </section>
      )}

      {relatedServiceLinks.length > 0 && (
        <section className="py-20 lg:py-28 relative z-10 border-t border-white/[0.05]">
          <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
            <div className="mb-10 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
                Related Service Paths
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                Useful next pages for this project type
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/50">
                These connected services help buyers compare adjacent workflows before requesting a fixed-scope quote.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedServiceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-teal/25 hover:bg-white/[0.05]"
                >
                  <span className="text-lg font-semibold text-white">{item.label}</span>
                  <p className="mt-3 text-sm leading-6 text-white/50">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
