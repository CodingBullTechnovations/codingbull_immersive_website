import Link from 'next/link';
import type { WhatWeBuildItem } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';
import { SystemMockup, type SystemMockupKind } from '@/components/sections/SystemMockup';
import type { MindShapeName } from '@/components/animations/mindShapes';

interface IndustryStoryProps {
  items: WhatWeBuildItem[];
}

interface BeatMeta {
  shape: MindShapeName;
  mockup: SystemMockupKind;
  chips: string[];
}

/**
 * Maps each service item to the formation the particle mind should hold and the
 * stylized mockup shown alongside it. Keyed by the content `icon` so copy stays
 * owned by content/home.ts.
 */
const BEAT_META: Record<string, BeatMeta> = {
  health: { shape: 'healthcare', mockup: 'healthcare', chips: ['Scheduling', 'Patient flow', 'Clinic CRM'] },
  cart: { shape: 'commerce', mockup: 'commerce', chips: ['Storefront', 'Order routing', 'Inventory'] },
  users: { shape: 'hrms', mockup: 'hrms', chips: ['Attendance', 'Payroll', 'Approvals'] },
  settings: { shape: 'custom', mockup: 'custom', chips: ['CRM', 'Dashboards', 'Integrations'] },
};

const FALLBACK: BeatMeta = { shape: 'custom', mockup: 'custom', chips: [] };

/**
 * The "what we build" chapter as scroll storytelling. Each industry is a beat
 * that (1) tells the particle field to morph into that industry's silhouette
 * via `data-mind-shape`, and (2) shows a crisp stylized system mockup in the
 * foreground. All headings, copy, chips, and service links are real
 * server-rendered HTML — the field and mockups are pure enhancement, so SEO,
 * GEO, and AEO are unaffected.
 */
export function IndustryStory({ items }: IndustryStoryProps) {
  return (
    <section className="mind-section relative overflow-hidden" aria-labelledby="systems-title">
      <div className="cb-section pb-0">
        <div className="cb-shell">
          <Reveal className="field-readable grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="cb-kicker">Systems / 02</p>
              <h2 id="systems-title" className="cb-display mt-6">We build a different system for every operation.</h2>
            </div>
            <p className="cb-copy max-w-2xl lg:justify-self-end">
              Scroll through the operations we engineer. Each is built around the people, decisions, data, and exceptions that keep that industry moving — not a reskinned template.
            </p>
          </Reveal>
        </div>
      </div>

      {items.map((item, index) => {
        const meta = BEAT_META[item.icon] ?? FALLBACK;
        const flip = index % 2 === 1;
        return (
          <div
            key={item.title}
            data-mind-shape={meta.shape}
            className="cb-shell grid items-center gap-10 px-5 py-16 sm:px-8 lg:min-h-[80vh] lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24"
          >
            <Reveal className={`field-readable ${flip ? 'lg:order-2' : ''}`}>
              <p className="cb-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                {String(index + 1).padStart(2, '0')} / {item.title}
              </p>
              <h3 className="mt-5 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
                {item.title}
              </h3>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/78">{item.description}</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {meta.chips.map((chip) => (
                  <span key={chip} className="cb-mono text-xs uppercase tracking-[0.14em] text-white/62">{chip}</span>
                ))}
              </div>
              <Link
                href={item.href}
                className="group mt-9 inline-flex min-h-12 items-center gap-3 border border-white/14 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition-all duration-300 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
              >
                Explore {item.title}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">↗</span>
              </Link>
            </Reveal>

            <Reveal
              delay={0.1}
              className={`field-readable relative ${flip ? 'lg:order-1' : ''}`}
            >
              <SystemMockup kind={meta.mockup} />
            </Reveal>
          </div>
        );
      })}
    </section>
  );
}
