import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { caseStudies, caseStudiesBySlug, type CaseStudy } from '@/content/case-studies';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { generatePageMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';
import { JsonLd, generateBreadcrumbSchema, generateCreativeWorkSchema } from '@/lib/schema';
import { getCaseStudyBySlug, listCaseStudySlugStatuses } from '@/lib/server/public-content';
import { ContentStatus } from '@prisma/client';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbStudies = await listCaseStudySlugStatuses();
  const dbStatusBySlug = new Map(dbStudies.map((item) => [item.slug, item.status]));
  const slugs = new Set([
    ...dbStudies.filter((item) => item.status === ContentStatus.PUBLISHED).map((item) => item.slug),
    ...caseStudies.filter((item) => !dbStatusBySlug.has(item.slug)).map((item) => item.slug),
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbStudy = await getCaseStudyBySlug(slug);
  const study = dbStudy
    ? (dbStudy.status === ContentStatus.PUBLISHED ? mapDbCaseStudy(dbStudy) : null)
    : caseStudiesBySlug[slug];
  if (!study) return {};

  return generatePageMetadata({
    title: `${study.title} | Case Study | CodingBull`,
    description: study.challenge.substring(0, 160),
    canonical: `${siteConfig.baseUrl}/case-studies/${slug}`,
  });
}

function pairStats(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null;
      const record = item as Record<string, unknown>;
      return { label: String(record.label ?? ''), value: String(record.value ?? '') };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item?.label && item.value));
}

function mapDbCaseStudy(study: Awaited<ReturnType<typeof getCaseStudyBySlug>>): CaseStudy | null {
  if (!study) return null;
  const stats = pairStats(study.metrics);
  const architecture = Array.isArray(study.architecture) ? study.architecture : [];

  return {
    slug: study.slug,
    title: study.title,
    client: study.client,
    category: study.industry,
    year: String((study.publishedAt ?? study.createdAt).getFullYear()),
    accentColor: 'teal',
    challenge: study.problem,
    solution: study.solution,
    outcome: study.outcomes,
    stats,
    techStack: architecture
      .map((item) => (typeof item === 'object' && item !== null ? String((item as Record<string, unknown>).title ?? '') : ''))
      .filter(Boolean),
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const dbStudy = await getCaseStudyBySlug(slug);
  const study = dbStudy
    ? (dbStudy.status === ContentStatus.PUBLISHED ? mapDbCaseStudy(dbStudy) : null)
    : caseStudiesBySlug[slug];
  if (!study) notFound();

  const caseUrl = `${siteConfig.baseUrl}/case-studies/${study.slug}`;

  return (
    <>
      <JsonLd data={generateCreativeWorkSchema({
        name: study.title,
        description: study.challenge,
        url: caseUrl,
        about: study.category,
      })} />
      <JsonLd data={generateBreadcrumbSchema([
        { name: 'Home', url: siteConfig.baseUrl },
        { name: 'Case Studies', url: `${siteConfig.baseUrl}/case-studies` },
        { name: study.client, url: caseUrl },
      ])} />

      <PageHero
        title={study.client}
        subtitle={study.title}
      />

      <SectionWrapper className="py-24">
        <div className="max-w-4xl mx-auto">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-24">
            {study.stats.map((stat) => (
              <div key={stat.label} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 text-center">
                <span className="text-3xl font-black text-white block mb-2">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal mb-4">The Challenge</h2>
                <p className="text-xl text-white/80 leading-relaxed font-light">{study.challenge}</p>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal mb-4">The Solution</h2>
                <p className="text-xl text-white/80 leading-relaxed font-light">{study.solution}</p>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-teal mb-4">The Outcome</h2>
                <p className="text-xl text-white/80 leading-relaxed font-light">{study.outcome}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-12">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Tech Architecture</h3>
                <div className="flex flex-wrap gap-2">
                  {study.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-white/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-teal/10 border border-teal/20">
                <h3 className="text-sm font-black mb-4 italic">Next System: Building one for you?</h3>
                <p className="text-xs text-white/60 mb-8 leading-relaxed">
                  We specialize in taking complex challenges like this and building proprietary solutions.
                </p>
                <Button
                  label="Enquire Now"
                  href="/contact"
                  variant="primary"
                  size="default"
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
