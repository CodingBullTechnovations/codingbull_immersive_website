import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CaseStudy } from '@/content/case-studies';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Button } from '@/components/ui/Button';

type ServiceLink = { label: string; href: string; description?: string };

function accentForPageHero(accentColor: string) {
  if (accentColor === 'blue') return 'sky';
  return accentColor;
}

function fallbackServices(study: CaseStudy): ServiceLink[] {
  const lower = `${study.category} ${study.title} ${study.challenge}`.toLowerCase();
  if (lower.includes('clinic') || lower.includes('healthcare') || lower.includes('ivf') || lower.includes('patient')) {
    const services = [
      { label: 'Healthcare Software Development', href: '/services/healthcare-software-development' },
      { label: 'Clinic Management Software Development', href: '/services/clinic-management-software-development' },
    ];
    if (lower.includes('ivf') || lower.includes('hospital')) {
      services.push({ label: 'Hospital Management Software Development', href: '/services/hospital-management-software-development' });
    }
    services.push({ label: 'Contact CodingBull', href: '/contact' });
    return services;
  }
  if (lower.includes('industrial') || lower.includes('portfolio') || lower.includes('mechanical')) {
    return [
      { label: 'Web Development Company in Ahmedabad', href: '/web-development-company-ahmedabad' },
      { label: 'Custom Business Systems', href: '/services/custom-business-systems' },
      { label: 'Inventory and Order Management Software', href: '/services/inventory-order-management-software' },
      { label: 'Software Development Company in Ahmedabad', href: '/software-development-company-ahmedabad' },
      { label: 'Contact CodingBull', href: '/contact' },
    ];
  }
  return [
    { label: 'Custom Business Systems', href: '/services/custom-business-systems' },
    { label: 'Contact CodingBull', href: '/contact' },
  ];
}

function fallbackModules(study: CaseStudy) {
  return [
    study.projectType || study.category,
    'Business workflow discovery',
    'Public or internal system structure',
    'Responsive user experience foundation',
    'Maintainable technical implementation',
  ].filter(Boolean);
}

function fallbackBusinessValue(study: CaseStudy) {
  return [
    study.outcome,
    'Created a clearer foundation for business presentation, operations, or inquiry handling.',
    'Designed to support future improvements as more real usage data becomes available.',
  ];
}

function fallbackRoadmap() {
  return [
    'Add deeper service, project, or workflow pages as approved facts become available.',
    'Connect CRM, reporting, or automation workflows if future operating needs justify them.',
    'Use real usage data to decide which module should be improved next.',
  ];
}

export function CaseStudyProofPage({ study }: { study: CaseStudy }) {
  const summary = study.summary ?? study.challenge;
  const services = study.servicesInvolved?.length ? study.servicesInvolved : fallbackServices(study);
  const modules = study.modules?.length ? study.modules : fallbackModules(study);
  const technicalApproach = study.technicalApproach?.length ? study.technicalApproach : study.techStack.map((tech) => `${tech} used in the project architecture.`);
  const businessValue = study.businessValue?.length ? study.businessValue : fallbackBusinessValue(study);
  const roadmap = study.roadmap?.length ? study.roadmap : fallbackRoadmap();
  const cta = study.cta ?? {
    title: 'Need a similar system?',
    description: 'Share the workflow, proof, service pages, dashboards, or automation your business needs. CodingBull can scope a focused fixed-price build.',
    label: 'Get Fixed-Scope Quote',
  };

  const snapshot = [
    { label: 'Industry', value: study.category },
    { label: 'Market', value: study.market ?? 'Not specified in public case-study data' },
    { label: 'Project type', value: study.projectType ?? study.title },
    { label: 'Main service', value: study.mainServiceCategory ?? study.category },
    { label: 'Delivery model', value: study.deliveryModel ?? 'Founder-led custom build' },
    { label: 'Status', value: study.status ?? 'Public case study' },
  ];

  return (
    <>
      <PageHero
        title={study.client}
        subtitle={summary}
        badge={study.mainServiceCategory ?? study.category}
        accentColor={accentForPageHero(study.accentColor)}
      />

      <SectionWrapper className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Case Study Summary</p>
              <h2 className="mt-4 text-3xl font-bold text-white lg:text-5xl">{study.title}</h2>
              <p className="mt-5 text-base leading-7 text-white/60">{summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button label={cta.label} href="/contact" variant="primary" trackingSource={`case_study_${study.slug}_primary`} />
                <Button label="Review Services" href="/services" variant="secondary" trackingSource={`case_study_${study.slug}_services`} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {snapshot.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{item.label}</p>
                  <p className="mt-3 text-sm leading-6 text-white/70">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {study.stats.length > 0 && (
        <SectionWrapper className="border-y border-white/10 bg-black/30 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-teal">Snapshot Proof Points</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {study.stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-7 text-center">
                  <span className="block text-3xl font-black text-white">{stat.value}</span>
                  <span className="mt-2 block text-[10px] uppercase tracking-widest text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-12">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Business Problem</p>
              <h2 className="mt-4 text-3xl font-bold text-white">What needed to be solved</h2>
              <p className="mt-5 text-lg font-light leading-8 text-white/70">{study.challenge}</p>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">What CodingBull Built</p>
              <h2 className="mt-4 text-3xl font-bold text-white">The delivered system</h2>
              <p className="mt-5 text-lg font-light leading-8 text-white/70">{study.solution}</p>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Business Value</p>
              <h2 className="mt-4 text-3xl font-bold text-white">What the project was designed to support</h2>
              <div className="mt-6 space-y-3">
                {businessValue.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/60">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Technical Approach</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-white/60">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {technicalApproach.map((item) => (
                  <p key={item} className="text-sm leading-6 text-white/55">{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-teal/20 bg-teal/[0.04] p-6">
              <h2 className="text-xl font-bold text-white">{cta.title}</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">{cta.description}</p>
              <Button label={cta.label} href="/contact" variant="primary" trackingSource={`case_study_${study.slug}_aside_cta`} className="mt-6" />
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Key Modules and Features</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Reusable project building blocks</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <div key={module} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                <p className="mt-3 text-sm leading-6 text-white/65">{module}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Related Services</p>
            <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">Services connected to this proof</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              These links connect the case study to the service pages a buyer would naturally compare before contacting CodingBull.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="group rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-teal/30 hover:bg-white/[0.05]">
                <span className="text-base font-semibold text-white group-hover:text-teal">{service.label}</span>
                {service.description && <p className="mt-3 text-sm leading-6 text-white/50">{service.description}</p>}
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                  View service
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
            <Link href="/contact" className="group rounded-lg border border-teal/20 bg-teal/[0.05] p-5 transition-colors hover:border-teal/40 hover:bg-teal/[0.08]">
              <span className="text-base font-semibold text-white group-hover:text-teal">Contact CodingBull</span>
              <p className="mt-3 text-sm leading-6 text-white/55">Share a similar workflow, website, dashboard, or business system requirement.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                Start inquiry
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="border-t border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Future Roadmap</p>
              <h2 className="mt-4 text-3xl font-bold text-white lg:text-4xl">What can be improved next</h2>
              <p className="mt-5 text-sm leading-6 text-white/55">
                Roadmap ideas are written as realistic future opportunities, not as claims that every module already exists.
              </p>
            </div>
            <div className="space-y-3">
              {roadmap.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
