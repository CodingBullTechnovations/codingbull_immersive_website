import type { ProcessStep } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section className="mind-section cb-section" aria-labelledby="process-title">
      <div className="cb-shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="cb-kicker">Protocol / 06</p>
          <h2 id="process-title" className="cb-display mt-6">How we deliver fixed-price custom software.</h2>
          <p className="cb-copy mt-7 max-w-lg">
            Each stage removes a different form of delivery risk—from unclear workflows to uncertain budgets and fragile handover.
          </p>
        </Reveal>

        <Reveal mode="group" as="div">
          <ol className="border-t border-white/10">
            {steps.map((step, index) => (
              <li
                key={step.number}
                data-reveal=""
                style={{ ['--reveal-delay' as string]: `${index * 0.07}s` }}
                className="group grid gap-5 border-b border-white/10 py-9 transition-colors duration-500 hover:bg-white/[0.012] sm:grid-cols-[4.5rem_0.55fr_1fr] sm:gap-8 sm:py-11"
              >
                <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.03em] text-white sm:text-2xl">{step.title}</h3>
                <p className="text-sm leading-7 text-white/52 sm:text-base">{step.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
