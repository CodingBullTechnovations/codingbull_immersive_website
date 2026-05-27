import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, Shield, TimerReset, TrendingUp } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata(pageMetadata.usa);

export default function USAPage() {
  const enterpriseSignals = [
    {
      label: 'Procurement-ready delivery model',
      detail: 'Clear scope statements, milestone owners, and sign-off checkpoints.',
      icon: ClipboardCheck,
    },
    {
      label: 'Compliance-scoped architecture',
      detail: 'Security and access boundaries mapped during discovery and implemented in the build plan.',
      icon: Shield,
    },
    {
      label: 'Executive reporting rhythm',
      detail: 'Regular progress updates in outcome terms: timeline, risk, and measurable impact.',
      icon: TrendingUp,
    },
  ];

  const procurementChecklist = [
    'System boundaries documented before development starts.',
    'Role/access model mapped for internal teams and vendors.',
    'Data movement and audit expectations captured in writing.',
    'Change requests tracked against timeline and cost impact.',
  ];

  return (
    <>
      <PageHero
        title="Custom Software Development for USA Businesses"
        subtitle="Built for procurement confidence: scoped architecture, controlled delivery, and measurable business outcomes."
      />

      <SectionWrapper className="border-b border-white/10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {enterpriseSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article key={signal.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="h-5 w-5 text-teal" />
                  <h2 className="mt-4 text-xl font-semibold text-white">{signal.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">{signal.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-teal">USA Procurement Checklist</p>
            <h3 className="mt-3 text-2xl font-bold text-white">What leadership teams usually ask first</h3>
            <ul className="mt-6 space-y-3">
              {procurementChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs text-white/45">Need industry references before kickoff?</p>
              <Link href="/case-studies" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-primary-hover">
                Review delivery proof <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="rounded-lg border border-white/10 bg-black/30 p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-teal">Enterprise Delivery Positioning</p>
            <h2 className="mt-4 text-3xl font-bold text-white">US-ready execution without generic agency overhead</h2>
            <p className="mt-4 text-base leading-7 text-white/60">
              We support healthcare, e-commerce, HRMS, and custom systems for USA teams that need reliability in
              technical execution and communication. Every project is anchored to measurable outcomes and explicit
              risk tracking from day one.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <TimerReset className="h-4 w-4 text-teal" />
                <p className="mt-3 text-sm font-semibold text-white">Decision latency reduction</p>
                <p className="mt-2 text-xs leading-5 text-white/55">Direct founder access reduces back-and-forth in architecture and scope decisions.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <Shield className="h-4 w-4 text-teal" />
                <p className="mt-3 text-sm font-semibold text-white">Risk-controlled implementation</p>
                <p className="mt-2 text-xs leading-5 text-white/55">Access, audit, and data handling controls are planned before code is shipped.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-white/[0.03] px-8 py-10 text-center">
          <h3 className="text-3xl font-bold text-white">Need a USA delivery plan with clear ownership?</h3>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/60">
            Share your target workflow and operating constraints. We will map scope, delivery phases, and reporting cadence
            so procurement and execution teams stay aligned.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button label="Request USA Delivery Plan" href="/contact" variant="primary" size="large" trackingSource="usa_page_cta_primary" />
            <Button label="Review Service Areas" href="/services" variant="secondary" size="large" trackingSource="usa_page_cta_secondary" />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
