import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { FounderNote } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface FounderNoteSectionProps {
  content: FounderNote;
}

/**
 * The human chapter. Dark like the rest of the narrative so the particle field
 * keeps flowing behind it — the portrait itself carries the "human moment"
 * through lighting, not through a jarring light panel.
 */
export function FounderNoteSection({ content }: FounderNoteSectionProps) {
  return (
    <section className="mind-section relative overflow-hidden px-5 py-20 sm:px-8 lg:px-10 lg:py-28" aria-labelledby="founder-title">
      <div className="pointer-events-none absolute -right-16 top-10 font-[family-name:var(--font-display)] text-[clamp(8rem,22vw,24rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.02]">PD</div>

      <Reveal className="relative mx-auto grid max-w-[var(--max-w-wide)] border border-white/14 bg-[var(--surface-card)] lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative min-h-[28rem] overflow-hidden border-b border-white/10 lg:min-h-[46rem] lg:border-b-0 lg:border-r">
          <Image
            src="/images/about/cbt-founder.jpeg"
            alt={`${content.name}, ${content.role}`}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-top"
          />
          {/* Grades the portrait into the dark system without hiding the face. */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.10)_0%,rgba(5,7,10,0.30)_55%,rgba(5,7,10,0.92)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,transparent_35%,rgba(5,7,10,0.55)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-24 text-white">
            <p className="text-lg font-semibold">{content.name}</p>
            <p className="cb-mono mt-1 text-xs uppercase tracking-[0.14em] text-[var(--accent-soft)]">{content.role}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-16 xl:p-20">
          <div>
            <p className="cb-kicker">Founder accountability / 07</p>
            <h2 id="founder-title" className="mt-7 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(2.5rem,4.4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
              You speak with the architect, not a relay team.
            </h2>
            <blockquote className="mt-10 max-w-3xl border-l border-[var(--accent)]/70 pl-6 text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">
              “{content.message}”
            </blockquote>
          </div>

          <div className="mt-12 flex flex-col gap-7 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="hidden lg:block">
              <p className="text-lg font-semibold text-white">{content.name}</p>
              <p className="cb-mono mt-1 text-xs uppercase tracking-[0.13em] text-white/62">{content.role}</p>
            </div>
            <Button
              label={content.cta.label}
              href={content.cta.href}
              variant={content.cta.variant}
              icon={content.cta.icon}
              trackingSource={content.cta.trackingSource}
              size="large"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
