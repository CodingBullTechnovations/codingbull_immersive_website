import Link from 'next/link';
import { caseStudiesBySlug } from '@/content/case-studies';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { getCaseStudyBySlug, isCaseStudyPubliclyVisible } from '@/lib/server/public-content';

interface FeaturedCaseStudiesProps {
  slugs: string[];
}

type FeaturedStudy = {
  slug: string;
  year: string;
  category: string;
  client: string;
  summary: string;
  modules: string[];
};

function architectureTitles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (typeof item === 'object' && item !== null) {
      const title = String((item as Record<string, unknown>).title ?? '');
      return title ? [title] : [];
    }
    return [];
  });
}

export async function FeaturedCaseStudies({ slugs }: FeaturedCaseStudiesProps) {
  const dbStudies = await Promise.all(slugs.map((slug) => getCaseStudyBySlug(slug)));
  const studies = slugs.flatMap<FeaturedStudy>((slug, index) => {
    const dbStudy = dbStudies[index];
    if (dbStudy) {
      if (!isCaseStudyPubliclyVisible(dbStudy)) return [];
      const modules = architectureTitles(dbStudy.architecture);
      return [{
        slug: dbStudy.slug,
        year: String((dbStudy.publishedAt ?? dbStudy.createdAt).getFullYear()),
        category: dbStudy.industry,
        client: dbStudy.client,
        summary: dbStudy.problem,
        modules: modules.length > 0 ? modules : ['Custom system architecture'],
      }];
    }

    const fallback = caseStudiesBySlug[slug];
    if (!fallback) return [];
    return [{
      slug: fallback.slug,
      year: fallback.year,
      category: fallback.category,
      client: fallback.client,
      summary: fallback.summary ?? fallback.challenge,
      modules: fallback.modules ?? fallback.techStack,
    }];
  });

  return (
    <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="deployment-title">
      <div className="cb-shell">
        <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="cb-kicker">Deployments / 03</p>
            <h2 id="deployment-title" className="cb-display mt-6 max-w-[12ch]">
              Systems measured in operating reality.
            </h2>
          </div>
          <Button label="View all case studies" href="/case-studies" variant="secondary" icon="arrow" trackingSource="home_case_studies_cta" />
        </Reveal>

        <Reveal mode="group" className="divide-y divide-white/10">
          {studies.map((study, index) => (
            <article
              key={study.slug}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              className="grid gap-8 py-12 lg:grid-cols-[0.18fr_0.72fr_0.68fr_0.32fr] lg:items-start lg:gap-10 lg:py-16"
            >
              <div className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">0{index + 1} / {study.year}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/45">{study.category}</p>
                <h3 className="mt-3 max-w-[14ch] font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.02] tracking-[-0.03em] text-white sm:text-4xl">
                  {study.client}
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">{study.summary}</p>
              </div>
              <div className="border border-white/12 bg-white/[0.015]">
                <p className="cb-mono border-b border-white/12 px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--accent-soft)]">System modules</p>
                {study.modules.slice(0, 3).map((module, moduleIndex) => (
                  <div key={module} className="flex min-h-14 items-center gap-3 border-b border-white/12 px-4 py-3 last:border-b-0">
                    <span className="cb-mono text-xs text-white/35">0{moduleIndex + 1}</span>
                    <p className="text-sm leading-6 text-white/70">{module}</p>
                  </div>
                ))}
              </div>
              <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-soft)] transition-colors hover:text-white lg:justify-self-end">
                Read the {study.client} deployment <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
