'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';
import { useCinematicFrameStage } from '@/components/animations/CinematicFrameStage';

gsap.registerPlugin(ScrollTrigger);

interface MultiFrameHeroProps {
  frames: string[];
  mobileFrames?: string[];
  children?: React.ReactNode;
  textSections?: React.ReactNode[];
  weights?: number[];
  mobileWeights?: number[];
  scrollHeight?: string; // e.g. '500vh', '800vh' to control animation speed
}

export function MultiFrameHero({
  frames,
  mobileFrames,
  children,
  textSections,
  weights,
  mobileWeights,
  scrollHeight = '500vh',
}: MultiFrameHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const performanceProfile = useDevicePerformanceProfile();
  const activeFrames = performanceProfile === 'mobilePremium' && mobileFrames?.length ? mobileFrames : frames;
  const activeWeights = performanceProfile === 'mobilePremium' && mobileWeights?.length ? mobileWeights : weights;
  const { isReady: imagesLoaded } = useCinematicFrameStage({
    canvasRef,
    containerRef,
    frames: activeFrames,
    profile: performanceProfile,
    scrub: performanceProfile === 'mobilePremium' ? true : 1.5,
    preloadRadius: performanceProfile === 'mobilePremium' ? 10 : undefined,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const isMobilePremium = performanceProfile === 'mobilePremium';

    const ctx = gsap.context(() => {
      // Parallax zoom on canvas
      if (canvasRef.current && performanceProfile !== 'reducedMotion') {
        gsap.fromTo(canvasRef.current,
          { scale: 1 },
          {
            scale: isMobilePremium ? 1.06 : 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: isMobilePremium ? true : 1.5,
            },
          }
        );
      }

      // Text section cross-fading
      if (textSections && textSections.length > 0) {
        const numSections = textSections.length;
        const timelineWeights = activeWeights && activeWeights.length === numSections ? activeWeights : Array(numSections).fill(1);
        const totalWeight = timelineWeights.reduce((acc: number, w: number) => acc + w, 0);

        // Initialize states
        textRefs.current.forEach((el, i) => {
          if (!el) return;
          const items = el.querySelectorAll('.hero-anim-item');

          if (i === 0) {
            gsap.set(el, { opacity: 1, pointerEvents: 'auto' });
            gsap.set(items, { opacity: 1, filter: 'blur(0px)', scale: 1, rotateX: 0, z: 0, y: 0 });
          } else {
            gsap.set(el, { opacity: 0, pointerEvents: 'none' });
            gsap.set(items, isMobilePremium
              ? { opacity: 0, scale: 0.94, y: 24 }
              : { opacity: 0, filter: 'blur(15px)', scale: 0.5, rotateX: 45, z: -500 }
            );
          }
        });

        if (performanceProfile === 'reducedMotion') return;

        // Build a timeline NOT attached to pin — uses the container's natural scroll height
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: isMobilePremium ? true : 1.5,
          },
        });

        textRefs.current.forEach((el, i) => {
          if (!el) return;
          const items = el.querySelectorAll('.hero-anim-item');

          const weightBefore = timelineWeights.slice(0, i).reduce((acc: number, w: number) => acc + w, 0);
          const startTime = weightBefore / totalWeight;
          const sectionDuration = timelineWeights[i] / totalWeight;
          // Slight overlap ensures 1 section fades out right as the other triggers
          const endTime = startTime + sectionDuration;

          if (i !== 0) {
            tl.set(el, { pointerEvents: 'auto' }, startTime);
            tl.to(el, { opacity: 1, duration: sectionDuration * 0.1 }, startTime);

            tl.to(items, {
              opacity: 1,
              scale: 1,
              ...(isMobilePremium ? { y: 0 } : { rotateX: 0, z: 0, filter: 'blur(0px)' }),
              stagger: 0.05,
              duration: sectionDuration * 0.45,
              ease: isMobilePremium ? 'power3.out' : 'back.out(1.5)'
            }, startTime);
          }

          if (i !== numSections - 1) {
            tl.to(items, {
              opacity: 0,
              scale: isMobilePremium ? 1.04 : 1.5,
              ...(isMobilePremium ? { y: -20 } : { rotateX: -45, z: 500, filter: 'blur(20px)' }),
              stagger: 0.03,
              duration: sectionDuration * 0.35,
              ease: 'power3.inOut'
            }, endTime - (sectionDuration * 0.4));

            tl.set(el, { pointerEvents: 'none' }, endTime - 0.05);
            tl.to(el, { opacity: 0, duration: sectionDuration * 0.1 }, endTime - 0.05);
          }
        });
      } else if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          y: -150,
          scale: 0.95,
          opacity: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
          }
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [activeWeights, performanceProfile, textSections]);

  return (
    // Height: scrollHeight creates the scroll distance dynamically (def: 500vh)
    <div ref={containerRef} className="relative w-full" style={{ height: scrollHeight }}>
      {/* Sticky viewport — replaces GSAP pin with pure CSS */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Canvas */}
        <div className="absolute inset-0 w-full h-full z-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover origin-center"
          />
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/98 z-30 transition-opacity duration-1000">
              <span className="text-teal/60 text-[11px] tracking-[0.4em] font-medium uppercase animate-pulse">
                Rendering Premium Experience...
              </span>
            </div>
          )}
          <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
          <div className="absolute inset-0 z-10 opacity-[0.035] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />
        </div>

        {/* Text Content */}
        {textSections && textSections.length > 0 ? (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {textSections.map((section, idx) => (
              <div
                key={idx}
                ref={el => { textRefs.current[idx] = el; }}
                className="absolute inset-0 w-full h-full px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 mx-auto max-w-[90rem] sm:px-6 lg:px-8 pointer-events-none flex flex-col items-center justify-center"
                style={{ willChange: 'opacity', perspective: '1000px' }}
              >
                {section}
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={textContainerRef}
            className="relative z-30 flex flex-col items-start justify-center w-full h-full px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 mx-auto max-w-7xl sm:px-6 lg:px-8 pointer-events-none"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="pointer-events-auto w-full">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
