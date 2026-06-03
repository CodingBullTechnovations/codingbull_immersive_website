import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, FileText, Globe2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { PageHero } from '@/components/sections/PageHero';

interface LinkCard {
  title: string;
  href: string;
  description: string;
}

interface MarketHighlight {
  title: string;
  description: string;
}

interface CountryAuthorityPageProps {
  title: string;
  subtitle: string;
  marketLabel: string;
  intro: string;
  positioningTitle?: string;
  responseWindow: string;
  deliveryModel?: string;
  bestFitProjects?: string;
  marketHighlights?: MarketHighlight[];
  serviceSectionTitle?: string;
  serviceSectionDescription?: string;
  serviceFocus: LinkCard[];
  buyingSignals: string[];
  proofPoints: string[];
  caseStudyLinks?: LinkCard[];
  caseStudySectionTitle?: string;
  caseStudySectionDescription?: string;
  ctaLabel: string;
  ctaTrackingSource: string;
  whatsappLabel?: string;
}

export function CountryAuthorityPage({
  title,
  subtitle,
  marketLabel,
  intro,
  positioningTitle = 'Custom software built around operating reality',
  responseWindow,
  deliveryModel = 'Remote-first engineering with written scope, weekly delivery notes, and change-control visibility.',
  bestFitProjects = 'Healthcare, e-commerce, HRMS/payroll, internal CRM, workflow automation, dashboards, and custom business systems.',
  marketHighlights = [
    {
      title: 'Founder-led discovery',
      description: 'Direct architecture decisions before scope is finalized.',
    },
    {
      title: 'Fixed milestones',
      description: 'Delivery phases, responsibilities, and acceptance criteria are explicit.',
    },
    {
      title: 'SEO-aware systems',
      description: 'Canonical, crawlable, and schema-ready pages where public discovery matters.',
    },
  ],
  serviceSectionTitle = 'Commercial software priorities for this market',
  serviceSectionDescription,
  serviceFocus,
  buyingSignals,
  proofPoints,
  caseStudyLinks = [],
  caseStudySectionTitle = 'Relevant proof and project examples',
  caseStudySectionDescription = 'Review selected work that shows how CodingBull approaches websites, healthcare workflows, operations systems, and business software foundations.',
  ctaLabel,
  ctaTrackingSource,
  whatsappLabel = 'Discuss on WhatsApp',
}: CountryAuthorityPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} />

      <SectionWrapper className="border-b border-white/10 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-teal">{marketLabel}</p>
            <h2 className="mt-4 text-3xl font-bold text-white">{positioningTitle}</h2>
            <p className="mt-5 text-base leading-7 text-white/60">{intro}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {marketHighlights.map(({ title, description }) => (
                <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <ShieldCheck className="h-4 w-4 text-teal" />
                  <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/50">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-black/30 p-6">
            <Globe2 className="h-5 w-5 text-teal" />
            <h3 className="mt-4 text-xl font-semibold text-white">Market delivery notes</h3>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Response window</dt>
                <dd className="mt-1 text-sm leading-6 text-white/70">{responseWindow}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Delivery model</dt>
                <dd className="mt-1 text-sm leading-6 text-white/70">{deliveryModel}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Best-fit projects</dt>
                <dd className="mt-1 text-sm leading-6 text-white/70">{bestFitProjects}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.16em] text-teal">Service Focus</p>
            <h2 className="mt-4 text-3xl font-bold text-white">{serviceSectionTitle}</h2>
            {serviceSectionDescription && (
              <p className="mt-4 text-base leading-7 text-white/60">{serviceSectionDescription}</p>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {serviceFocus.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-teal">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{service.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-teal" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {caseStudyLinks.length > 0 && (
        <SectionWrapper className="py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.16em] text-teal">Case Study Proof</p>
              <h2 className="mt-4 text-3xl font-bold text-white">{caseStudySectionTitle}</h2>
              <p className="mt-4 text-base leading-7 text-white/60">{caseStudySectionDescription}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {caseStudyLinks.map((caseStudy) => (
                <Link
                  key={caseStudy.href}
                  href={caseStudy.href}
                  className="group rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-teal/30 hover:bg-white/[0.05]"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal">{caseStudy.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{caseStudy.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                    View case study
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <FileText className="h-5 w-5 text-teal" />
            <h2 className="mt-4 text-2xl font-bold text-white">Buyer questions we resolve before build</h2>
            <ul className="mt-6 space-y-3">
              {buyingSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-3 text-sm leading-6 text-white/60">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <Clock3 className="h-5 w-5 text-teal" />
            <h2 className="mt-4 text-2xl font-bold text-white">Proof signals clients should expect</h2>
            <ul className="mt-6 space-y-3">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/60">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16">
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-white/[0.03] px-8 py-10 text-center">
          <h2 className="text-3xl font-bold text-white">Need a scoped software build plan?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/60">
            Share the workflow, country context, integrations, timeline, and operational constraints. CodingBull will return a fixed-scope recommendation with clear delivery phases.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button label={ctaLabel} href="/contact" variant="primary" size="large" trackingSource={ctaTrackingSource} />
            <Button label={whatsappLabel} href="#whatsapp" icon="whatsapp" variant="secondary" size="large" trackingSource={`${ctaTrackingSource}_whatsapp`} />
            <Button label="Review Services" href="/services" variant="secondary" size="large" trackingSource={`${ctaTrackingSource}_services`} />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
