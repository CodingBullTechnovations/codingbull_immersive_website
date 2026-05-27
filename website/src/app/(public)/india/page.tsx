import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Building2, Clock3, Handshake, IndianRupee, MapPin, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata(pageMetadata.india);

export default function IndiaPage() {
  const executionPoints = [
    {
      title: 'Founder-direct scoping',
      detail: 'You speak directly with engineering leadership, not a relay account layer.',
      icon: Handshake,
    },
    {
      title: 'Fixed-price milestone plan',
      detail: 'Scope, delivery windows, and ownership are frozen before build starts.',
      icon: IndianRupee,
    },
    {
      title: 'Fast rollout for operations teams',
      detail: 'Systems are shipped for real daily usage, not demo-only launches.',
      icon: Zap,
    },
  ];

  const indiaPriorities = [
    'Clinic and patient workflow automation for multi-branch healthcare groups.',
    'Order, catalog, and stock operations for e-commerce brands scaling across states.',
    'Attendance, payroll, and approval workflows for HRMS-heavy operations teams.',
  ];

  return (
    <>
      <PageHero
        title="Custom Software Development in India"
        subtitle="Built for teams that need predictable delivery, clear pricing, and systems that match day-to-day operations."
      />

      <SectionWrapper className="py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {executionPoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="h-5 w-5 text-teal" />
                  <h2 className="mt-4 text-xl font-semibold text-white">{point.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">{point.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-teal">India Operating Model</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Made for fast-moving Indian operations</h2>
            <p className="mt-4 text-base leading-7 text-white/60">
              Most teams in India need rapid execution with strict cost discipline. This page is designed for that reality:
              outcome-first discovery, engineering-first execution, and founder-level accountability.
            </p>
            <ol className="mt-8 space-y-4">
              {indiaPriorities.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-teal/40 text-xs font-semibold text-teal">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-white/60">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold text-white">Coverage and response window</h3>
            <dl className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-teal" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Primary market</dt>
                  <dd className="mt-1 text-sm text-white">Ahmedabad, Mumbai, Bengaluru, Delhi NCR, Pune</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-teal" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Technical response</dt>
                  <dd className="mt-1 text-sm text-white">Architecture response within 48 working hours</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-teal" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Delivery mode</dt>
                  <dd className="mt-1 text-sm text-white">Fixed-price milestones with change-control notes</dd>
                </div>
              </div>
            </dl>
            <div className="mt-6 border-t border-white/10 pt-4">
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-primary-hover">
                Review industry service pages <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-white/[0.03] px-8 py-10 text-center">
          <ShieldCheck className="mx-auto h-6 w-6 text-teal" />
          <h3 className="mt-4 text-3xl font-bold text-white">Need a fixed-price build plan for India?</h3>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/60">
            Share your use case and constraints. We will return a scoped proposal with delivery milestones, accountability owners,
            and the exact systems we recommend for your industry.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button label="Get India Delivery Plan" href="/contact" variant="primary" size="large" trackingSource="india_page_cta_primary" />
            <Button label="View Case Studies" href="/case-studies" variant="secondary" size="large" trackingSource="india_page_cta_secondary" />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
