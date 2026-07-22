import Link from 'next/link';
import type { WhatWeBuildItem } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface WhatWeBuildSectionProps {
  items?: WhatWeBuildItem[];
  niches?: Array<{
    verticalId: string;
    title: string;
    subtitle: string;
    chips: string[];
    href: string;
  }>;
}

const modules = [
  ['Scheduling', 'Patient flow', 'Clinic CRM'],
  ['Storefront', 'Order routing', 'Inventory'],
  ['Attendance', 'Payroll', 'Approvals'],
  ['CRM', 'Dashboards', 'Integrations'],
];

export function WhatWeBuildSection({ items = [], niches }: WhatWeBuildSectionProps) {
  const entries = niches ?? items.map((item, index) => ({
    verticalId: item.icon,
    title: item.title,
    subtitle: item.description,
    chips: modules[index] ?? [],
    href: item.href,
  }));

  return (
    <section className="mind-section cb-section overflow-hidden border-b border-white/[0.08]" aria-labelledby="systems-title">
      <div className="cb-shell relative">
        <Reveal className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="cb-kicker">Systems / 02</p>
            <h2 id="systems-title" className="cb-display mt-6">One thinking layer, built around your operation.</h2>
          </div>
          <p className="cb-copy max-w-2xl lg:justify-self-end">
            We start with the workflow, not a feature checklist. Each system is engineered around the people, decisions, data, and exceptions that keep your operation moving.
          </p>
        </Reveal>

        <Reveal mode="group" className="divide-y divide-white/10">
          {entries.map((item, index) => (
            <article
              key={item.title}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
            >
              <Link
                href={item.href}
                className="group grid gap-6 py-12 transition-colors duration-500 sm:py-14 lg:grid-cols-[5rem_1.05fr_0.95fr_auto] lg:items-center lg:gap-10"
                aria-label={`Explore ${item.title}`}
              >
                <div className="cb-mono text-xs tracking-[0.2em] text-[var(--accent-soft)]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white/85 transition-all duration-500 group-hover:translate-x-2 group-hover:text-white">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {item.chips.map((module) => (
                      <span key={module} className="cb-mono text-xs uppercase tracking-[0.14em] text-white/36">{module}</span>
                    ))}
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-white/55 sm:text-base">{item.subtitle}</p>
                <span
                  className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/14 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 transition-all duration-300 group-hover:border-[var(--accent)]/60 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)] lg:justify-self-end"
                  aria-hidden="true"
                >
                  Explore <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </span>
              </Link>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
