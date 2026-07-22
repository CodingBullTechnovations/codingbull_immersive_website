import type { FAQItem } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section className="mind-section cb-section border-y border-white/[0.08]" aria-labelledby="faq-title">
      <div className="cb-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <Reveal>
          <p className="cb-kicker">Buyer answers / 08</p>
          <h2 id="faq-title" className="cb-display mt-6">Straight answers, before the first call.</h2>
          <p className="cb-copy mt-7 max-w-lg">Scope, price, timelines, technology, and support—answered without a sales script.</p>
        </Reveal>

        <Reveal className="border-t border-white/10" delay={0.1}>
          {items.map((item, index) => (
            <details key={item.question} className="group border-b border-white/10" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 text-left text-base font-medium leading-6 text-white marker:hidden sm:text-lg">
                <span className="flex gap-5"><span className="cb-mono mt-1 text-xs text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>{item.question}</span>
                <span className="mt-0.5 text-xl font-light text-white/45 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
              </summary>
              <p className="max-w-2xl pb-8 pl-10 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
