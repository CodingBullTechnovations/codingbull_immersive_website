'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';
import { useCinematicFrameStage } from '@/components/animations/CinematicFrameStage';

gsap.registerPlugin(ScrollTrigger);

// Module-level constant
const SEMICONDUCTOR_FRAMES = Array.from({ length: 240 }, (_, i) =>
  `/images/semiconductorframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
);
const MOBILE_SEMICONDUCTOR_FRAMES = Array.from({ length: 72 }, (_, i) =>
  `/images/mobile-frames/process-semiconductor/frame-${String(i + 1).padStart(3, '0')}.webp`
);

interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  description: string;
  highlights: string[];
}

interface CaseStudyScrollShowcaseProps {
  studies: CaseStudy[];
}

export function CaseStudyScrollShowcase({ studies }: CaseStudyScrollShowcaseProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const performanceProfile = useDevicePerformanceProfile();
  const activeFrames = performanceProfile === 'mobilePremium' ? MOBILE_SEMICONDUCTOR_FRAMES : SEMICONDUCTOR_FRAMES;
  const { isReady: imagesLoaded } = useCinematicFrameStage({
    canvasRef,
    containerRef,
    frames: activeFrames,
    profile: performanceProfile,
    start: 'top bottom',
    end: 'bottom top',
    lazyStart: 'top 120%',
    scrub: performanceProfile === 'mobilePremium' ? 0.35 : 0.3,
    preloadRadius: performanceProfile === 'mobilePremium' ? 10 : undefined,
  });

  useEffect(() => {
    if (!containerRef.current || performanceProfile === 'reducedMotion') return;

    const ctx = gsap.context(() => {
      // Fade-in cards as they enter viewport
      cardRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [performanceProfile]);

  return (
    <section ref={containerRef} className="relative w-full bg-black">
      {/* Sticky Background Canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute w-full h-full object-cover origin-center opacity-50 mix-blend-screen" />

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/98 z-30 transition-opacity duration-1000">
            <span className="text-teal/60 text-[11px] tracking-[0.4em] font-medium uppercase animate-pulse">
              Loading Case Studies...
            </span>
          </div>
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Scrolling Content */}
      <div className="relative z-10 w-full max-w-[var(--max-w-wide)] mx-auto px-6 lg:px-10 -mt-[100vh]">
        {/* Section Header */}
        <div className="pt-32 pb-40 text-center pointer-events-none">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal block mb-3">
            Deployed Architectures
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-teal to-white bg-clip-text text-transparent">Work</span>
          </h2>
        </div>

        {/* Case Study Cards */}
        <div className="flex flex-col gap-[25vh] pb-[30vh]">
          {studies.map((study, idx) => (
            <div
              key={study.title}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="w-full lg:max-w-2xl mx-auto lg:mx-0"
              style={{ marginLeft: idx % 2 === 0 ? 'auto' : undefined, marginRight: idx % 2 !== 0 ? 'auto' : undefined }}
            >
              <div className="bg-black/70 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(20,184,166,0.1)] group hover:border-teal/30 transition-all duration-500">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal block mb-4">
                  {study.industry}
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white mb-4 tracking-tight">
                  {study.title}
                </h3>
                <p className="text-white/50 text-sm lg:text-base leading-relaxed mb-6 font-light">
                  {study.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {study.highlights.map((h) => (
                    <span key={h} className="px-3 py-1.5 rounded-full border border-teal/20 bg-teal/[0.05] text-xs text-teal/80 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
                {study.slug && (
                  <Button
                    label="View Deployment Detail"
                    href={`/case-studies/${study.slug}`}
                    variant="secondary"
                    icon="arrow"
                    size="default"
                    trackingSource="case_study_scroll_showcase"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
