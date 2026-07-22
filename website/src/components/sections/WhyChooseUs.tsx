import type { WhyChooseUsItem } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface WhyChooseUsProps {
  items: WhyChooseUsItem[];
}

export function WhyChooseUs({ items }: WhyChooseUsProps) {
  return (
    <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="delivery-model-title">
      <div className="cb-shell">
        <Reveal className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="cb-kicker">Operating principles / 05</p>
            <h2 id="delivery-model-title" className="cb-display mt-6">Founder-led custom software. Without agency theatre.</h2>
          </div>
          <p className="cb-copy max-w-2xl lg:justify-self-end">
            The engagement is designed to remove ambiguity before development begins and keep technical accountability close to the people making business decisions.
          </p>
        </Reveal>

        <Reveal mode="group" className="mt-16 grid border-l border-t border-white/10 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.title}
              data-reveal=""
              style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              className="group min-h-64 border-b border-r border-white/10 bg-white/[0.008] p-7 transition-colors duration-500 hover:bg-[var(--accent)]/[0.04] sm:p-9 lg:p-11"
            >
              <div className="flex items-center justify-between">
                <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">0{index + 1}</span>
                <span className="h-1.5 w-1.5 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-150" />
              </div>
              <h3 className="mt-12 max-w-[16ch] font-[family-name:var(--font-display)] text-2xl font-medium leading-tight tracking-[-0.03em] text-white">{item.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/52">{item.description}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
