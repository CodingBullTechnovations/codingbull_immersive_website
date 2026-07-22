import Link from 'next/link';
import type { GraphLink } from '@/content/link-graph';
import { Reveal } from '@/components/animations/Reveal';

interface RelatedLinksRailProps {
  kicker: string;
  title: string;
  links: GraphLink[];
  /** Optional lead-in sentence above the list. */
  intro?: string;
}

/**
 * The one shared module for contextual internal links. Border-led, uses the
 * standard section shells and Reveal choreography so every page's related
 * links look and behave identically. Renders nothing when there are no links.
 */
export function RelatedLinksRail({ kicker, title, links, intro }: RelatedLinksRailProps) {
  if (links.length === 0) return null;

  return (
    <section className="cb-section border-t border-white/[0.08] bg-[#05070a]" aria-labelledby={`rail-${kicker.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="cb-shell">
        <Reveal className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="cb-kicker">{kicker}</p>
            <h2
              id={`rail-${kicker.replace(/\s+/g, '-').toLowerCase()}`}
              className="cb-display mt-6 max-w-[14ch] text-[clamp(1.9rem,3.4vw,3.2rem)]"
            >
              {title}
            </h2>
          </div>
          {intro && <p className="cb-copy max-w-2xl lg:justify-self-end">{intro}</p>}
        </Reveal>

        <Reveal mode="group" className="divide-y divide-white/10">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.06}s` }}
              className="group grid gap-3 py-7 transition-colors duration-500 sm:grid-cols-[4rem_0.9fr_1.1fr] sm:items-center sm:gap-8"
            >
              <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-medium tracking-[-0.02em] text-white/85 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white sm:text-xl">
                {link.label} <span aria-hidden="true">↗</span>
              </h3>
              {link.description && (
                <p className="text-sm leading-6 text-white/55">{link.description}</p>
              )}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
