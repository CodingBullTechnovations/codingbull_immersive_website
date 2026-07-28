import { Button } from '@/components/ui/Button';
import type { CTAConfig } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface CTASectionProps {
  cta: CTAConfig;
  title?: string;
  description?: string;
  trustLine?: string;
  primaryLabel?: string;
  kicker?: string;
}

export function CTASection({
  cta,
  title = 'Bring the workflow. We’ll architect the system.',
  description = 'Tell us the users, decisions, exceptions, integrations, and outcome. We’ll turn that operating context into a clear scope, timeline, and fixed-price proposal.',
  trustLine = 'Founder-led review · Clear scope · No obligation',
  primaryLabel = 'Request a Scope Review',
  kicker = 'Project brief / 10',
}: CTASectionProps) {
  return (
    <section className="mind-section relative overflow-hidden px-5 py-24 sm:px-8 lg:px-10 lg:py-36" aria-labelledby="final-brief-title">
      <div className="public-grid pointer-events-none absolute inset-0 opacity-25" />

      <Reveal className="relative mx-auto max-w-[var(--max-w-wide)] border border-white/14 bg-[var(--surface-card)] p-7 sm:p-10 lg:p-16 xl:p-20">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div>
            <p className="cb-kicker">{kicker}</p>
            <h2 id="final-brief-title" className="mt-7 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(3rem,6.2vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
              {title}
            </h2>
          </div>

          <div>
            <p className="cb-copy max-w-xl">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button label={primaryLabel} href="/contact" variant="primary" icon="arrow" trackingSource="final_cta_scope_review" size="large" />
              <Button label={cta.label} href={cta.href} variant="secondary" icon="whatsapp" trackingSource={cta.trackingSource} size="large" />
            </div>
            <p className="cb-mono mt-7 text-xs uppercase tracking-[0.15em] text-white/58">{trustLine}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
