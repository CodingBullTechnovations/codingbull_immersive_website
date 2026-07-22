import Link from 'next/link';
import type { TrustStat } from '@/types/content';
import { Reveal } from '@/components/animations/Reveal';

interface TrustBarProps {
  stats: TrustStat[];
}

const proofSources = [
  { label: 'About the founder', href: '/about' },
  { label: 'Terms of engagement', href: '/terms' },
  { label: 'Published work', href: '/case-studies' },
  { label: 'Company profile', href: '/about' },
];

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section className="mind-section cb-section border-y border-white/[0.08]" aria-labelledby="proof-ledger-title">
      <div className="cb-shell">
        <Reveal className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="cb-kicker">Evidence ledger / 01</p>
            <h2 id="proof-ledger-title" className="cb-display mt-6 max-w-[11ch]">
              Facts before promises.
            </h2>
          </div>
          <p className="cb-copy max-w-2xl lg:justify-self-end">
            The operating model, published work, and company identity a buyer can inspect before starting a conversation.
          </p>
        </Reveal>

        <Reveal mode="group" className="grid md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const source = proofSources[index];
            return (
              <article
                key={stat.label}
                data-reveal=""
                style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
                className="group border-b border-white/10 py-9 md:border-r md:px-7 md:odd:pl-0 md:even:border-r-0 xl:border-b-0 xl:border-r xl:px-7 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0"
              >
                <p className="font-[family-name:var(--font-display)] text-[clamp(2.35rem,4.3vw,4.2rem)] font-medium leading-none tracking-[-0.035em] text-white">
                  {stat.value}
                </p>
                <h3 className="mt-4 text-sm font-semibold text-white/85">{stat.label}</h3>
                {source && (
                  <Link
                    href={source.href}
                    className="cb-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--accent-soft)] transition-colors hover:text-white"
                  >
                    {source.label} <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </article>
            );
          })}
        </Reveal>

        <div className="cb-mono mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.16em] text-white/58 sm:flex-row">
          <span>CodingBull Technovations Pvt. Ltd. · Ahmedabad, Gujarat</span>
          <span>GSTIN 24AAMCC7617E1ZP</span>
        </div>
      </div>
    </section>
  );
}
