import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { services, servicesBySlug } from '@/content/services';

export async function generateStaticParams() {
  return services.map(s => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const data = servicesBySlug[service];
  if (!data) return { title: 'Service Not Found' };

  return {
    title: `${data.title} | CodingBull Technovations`,
    description: data.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const serviceData = servicesBySlug[service];

  if (!serviceData) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={serviceData.title}
        subtitle={serviceData.description}
        badge={serviceData.features[0]?.title}
        accentColor={serviceData.accentColor}
      />

      {/* Pain Points Section */}
      <section className="py-20 lg:py-28 bg-[rgba(10,12,20,0.5)] border-y border-white/[0.05] relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Pain Points */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400/70 block mb-4">
                The Problem
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-tight mb-8">
                Challenges You&apos;re <span className="text-red-400">Facing</span>
              </h2>
              <div className="flex flex-col gap-4">
                {serviceData.painPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mt-0.5">
                      <span className="text-red-400 text-sm font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
                Our Solution
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-tight mb-8">
                How We <span className="text-teal">Solve It</span>
              </h2>
              <div className="p-8 rounded-2xl bg-teal/[0.04] border border-teal/15">
                <p className="text-white/70 text-base lg:text-lg leading-relaxed font-light">
                  {serviceData.solution}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mt-8">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 block mb-3">
                  Tech Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {serviceData.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[12px] text-white/50 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal block mb-4">
              Core Capabilities
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-tight">
              Powerful <span className="bg-gradient-to-r from-teal to-[#5aeacc] bg-clip-text text-transparent">Features</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceData.features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-teal/15 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal/20 group-hover:scale-110 transition-all duration-500">
                  <div className="w-3 h-3 rounded-full bg-teal shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-[family-name:var(--font-outfit)] group-hover:text-teal transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
