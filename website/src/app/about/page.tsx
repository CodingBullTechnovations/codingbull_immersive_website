import { PageHero } from '@/components/sections/PageHero';
import { FounderNoteSection } from '@/components/sections/FounderNoteSection';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata(pageMetadata.about);

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Engineering Excellence"
        subtitle="A deep dive into our core philosophy, our architects, and why we build custom infrastructure instead of reskinning templates."
        badge="About CodingBull"
        accentColor="violet"
      />

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-[rgba(10,12,20,0.5)] border-y border-white/[0.05] relative z-10">
        <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 block mb-4">
              Our Principles
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] text-white tracking-tight">
              What Drives <span className="bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Custom Over Template',
                description: 'Every line of code is written for your specific workflow. We don\'t reskin WordPress themes or configure SaaS platforms — we engineer from scratch.',
                icon: '⚡',
              },
              {
                title: 'Founder-Led Architecture',
                description: 'Our founder personally architects every project. No junior developers learning on your budget. You get senior-level decision-making from day one.',
                icon: '🏗️',
              },
              {
                title: 'Fixed-Price, No Surprises',
                description: 'We scope, estimate, and commit to a fixed price before writing the first line. No hourly billing games. If we underestimate, that\'s on us.',
                icon: '🎯',
              },
            ].map((value) => (
              <div key={value.title} className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-violet-400/20 transition-all duration-500">
                <div className="text-3xl mb-5">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 font-[family-name:var(--font-outfit)] group-hover:text-violet-300 transition-colors">
                  {value.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <FounderNoteSection content={homeContent.founderNote} />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
