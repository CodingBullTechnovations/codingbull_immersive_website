import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { HeroContent } from '@/types/content';

interface HeroSectionProps {
  content: HeroContent;
}

/**
 * Hero of the neural narrative. The section itself is transparent — the
 * persistent NeuralMind field renders behind it and forms the bull logo in
 * the right half of the viewport. A server-rendered static logo occupies the
 * same spot until the field is ready (and permanently for reduced motion),
 * so no visitor ever sees an empty stage.
 */
export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="cortex-hero relative isolate min-h-[100svh] overflow-hidden pt-24 text-white">
      <div className="cortex-noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="hero-readability-scrim pointer-events-none absolute inset-0 z-10 hidden lg:block" />
      {/* Mobile readability scrim: the field sits behind the copy on small
          screens, so dim it strongly where the text lives. Desktop keeps the
          clear split (copy left, field right). */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05070a]/98 via-[#05070a]/92 to-[#05070a]/58 lg:hidden" />

      {/* Static logo stage — replaced by the particle field once it resolves */}
      <div
        className="mind-static-logo pointer-events-none absolute inset-y-0 right-0 flex w-full items-center justify-center lg:w-[52%]"
        aria-hidden="true"
      >
        <div className="relative aspect-[0.84] h-[46%] max-h-[36rem] lg:h-[62%]">
          <div className="cortex-orbit cortex-orbit-a" />
          <div className="cortex-orbit cortex-orbit-b" />
          <div className="absolute inset-[10%] opacity-75 [filter:drop-shadow(0_0_28px_rgba(57,177,230,0.32))]">
            <Image src="/images/logo/logo.png" alt="" fill loading="eager" sizes="36vw" className="object-contain" />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[106rem] flex-col justify-end px-5 pb-24 sm:px-8 lg:px-10 xl:px-14">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-[var(--accent)]" />
          <p className="cb-mono text-xs uppercase tracking-[0.24em] text-[var(--accent-bright)]">
            Custom software · founder-led architecture
          </p>
        </div>

        <h1 className="max-w-[13ch] text-balance font-[family-name:var(--font-display)] text-[clamp(3.4rem,7vw,7.6rem)] font-medium leading-[0.92] tracking-[-0.04em] text-[#f2f4f5]">
          {content.headline}
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[36rem]">
            <p className="text-pretty border-l border-[var(--accent)]/70 pl-5 text-base font-normal leading-7 text-white/78 sm:text-lg sm:leading-8">
              {content.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                label={content.primaryCTA.label}
                href={content.primaryCTA.href}
                variant={content.primaryCTA.variant}
                icon={content.primaryCTA.icon}
                trackingSource={content.primaryCTA.trackingSource}
                size="large"
              />
              <Button
                label={content.secondaryCTA.label}
                href={content.secondaryCTA.href}
                variant={content.secondaryCTA.variant}
                icon={content.secondaryCTA.icon}
                trackingSource={content.secondaryCTA.trackingSource}
                size="large"
              />
            </div>
          </div>

          <div className="cb-mono hidden max-w-xs flex-col gap-2 text-xs uppercase leading-5 tracking-[0.18em] text-white/55 lg:flex">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--accent-bright)] shadow-[0_0_14px_var(--accent)]" />
              Live field · move to disturb, release to resolve
            </span>
            <span>Healthcare · Commerce · HRMS · CRM · Operations</span>
          </div>
        </div>
      </div>

      <div className="relative z-30 mx-auto flex max-w-[106rem] flex-wrap items-center justify-between gap-3 border-t border-white/[0.12] bg-[#05070a]/78 px-5 py-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-white/58 sm:px-8 lg:px-10 xl:px-14">
        <span>CodingBull Technovations Pvt. Ltd. · GST registered</span>
        <span className="hidden sm:inline">Scroll — the field follows the story</span>
        <span>Ahmedabad · India · Built for global operations</span>
      </div>
    </section>
  );
}
