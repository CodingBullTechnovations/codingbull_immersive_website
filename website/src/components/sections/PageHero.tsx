import { Reveal } from '@/components/animations/Reveal';

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[68svh] overflow-hidden border-b border-white/[0.08] bg-[#05070a] px-5 pb-16 pt-32 sm:px-8 lg:px-10 lg:pb-24 lg:pt-40">
      <div className="public-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(57,177,230,0.09),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[45svh] max-w-[var(--max-w-wide)] flex-col justify-end">
        <Reveal className="grid gap-8 lg:grid-cols-[0.18fr_0.82fr]">
          <div className="cb-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-soft)]">
            {badge ?? 'CodingBull Technovations'}
          </div>
          <div>
            <h1 className="max-w-[15ch] text-balance font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
              {title}
            </h1>
            <p className="mt-8 max-w-3xl border-l border-[var(--accent)]/45 pl-5 text-base leading-8 text-white/58 sm:text-lg sm:leading-9">
              {subtitle}
            </p>
          </div>
        </Reveal>

        <div className="cb-mono mt-14 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.17em] text-white/28">
          <span>Founder-led custom systems</span>
          <span>Ahmedabad · Global delivery</span>
        </div>
      </div>
    </section>
  );
}
