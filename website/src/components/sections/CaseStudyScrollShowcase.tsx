import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  description: string;
  highlights: string[];
}

interface CaseStudyScrollShowcaseProps {
  studies: CaseStudy[];
}

export function CaseStudyScrollShowcase({ studies }: CaseStudyScrollShowcaseProps) {
  return (
    <section className="cb-section border-b border-white/[0.08] bg-[#05070a]" aria-labelledby="case-index-title">
      <div className="cb-shell">
        <Reveal className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="cb-kicker">Deployment index</p>
            <h2 id="case-index-title" className="cb-display mt-6 max-w-[11ch]">Work with operating consequences.</h2>
          </div>
          <p className="cb-copy max-w-2xl lg:justify-self-end">The constraint, architecture, modules, and measurable outcome behind each deployed system.</p>
        </Reveal>

        <Reveal mode="group" className="divide-y divide-white/10">
          {studies.map((study, index) => (
            <article
              key={study.title}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
              className="grid gap-8 py-11 lg:grid-cols-[5rem_0.72fr_1fr_0.2fr] lg:items-center lg:gap-10 lg:py-14"
            >
              <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{study.industry}</p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] text-white">{study.title}</h3>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {study.highlights.map((highlight) => <span key={highlight} className="cb-mono text-xs uppercase tracking-[0.12em] text-white/40">{highlight}</span>)}
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-white/55 sm:text-base">{study.description}</p>
              {study.slug && (
                <Link href={`/case-studies/${study.slug}`} className="inline-flex h-12 w-12 items-center justify-center border border-white/15 text-lg text-[var(--accent-soft)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] lg:justify-self-end" aria-label={`View ${study.title}`}>
                  ↗
                </Link>
              )}
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
