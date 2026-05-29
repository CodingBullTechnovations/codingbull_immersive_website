'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/Button';
import { useDevicePerformanceProfile } from '@/hooks/useDevicePerformanceProfile';
import { useCinematicFrameStage } from '@/components/animations/CinematicFrameStage';

// 384 Frame Configuration
const FRAME_PATHS = [
  ...Array.from({ length: 80 }, (_, i) => `/images/semiconductorframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`),
  ...Array.from({ length: 80 }, (_, i) => `/images/healthcarejpgframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`),
  ...Array.from({ length: 64 }, (_, i) => `/images/e-commercejpgFrames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`),
  ...Array.from({ length: 80 }, (_, i) => `/images/hrmsjpgframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`),
  ...Array.from({ length: 80 }, (_, i) => `/images/websiteandsoftwareframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`),
];

const TOTAL_FRAMES = 384; 
const INDIVIDUAL_LENGTHS = [80, 80, 64, 80, 80];
const MOBILE_FRAME_PATHS = [
  ...Array.from({ length: 40 }, (_, i) => `/images/mobile-frames/industry-semiconductor/frame-${String(i + 1).padStart(3, '0')}.webp`),
  ...Array.from({ length: 40 }, (_, i) => `/images/mobile-frames/industry-healthcare/frame-${String(i + 1).padStart(3, '0')}.webp`),
  ...Array.from({ length: 32 }, (_, i) => `/images/mobile-frames/industry-ecommerce/frame-${String(i + 1).padStart(3, '0')}.webp`),
  ...Array.from({ length: 40 }, (_, i) => `/images/mobile-frames/industry-hrms/frame-${String(i + 1).padStart(3, '0')}.webp`),
  ...Array.from({ length: 40 }, (_, i) => `/images/mobile-frames/industry-custom/frame-${String(i + 1).padStart(3, '0')}.webp`),
];
const MOBILE_TOTAL_FRAMES = 192;
const MOBILE_INDIVIDUAL_LENGTHS = [40, 40, 32, 40, 40];

// Four primary commercial niches.
const industrialNiches = [
  {
    verticalId: 'HEALTHCARE',
    title: 'Healthcare Operating Systems',
    subtitle: 'EHR integrations, intelligent appointment engines, scoped privacy controls, audit-ready storage, and multi-location clinic coordination architecture.',
    chips: ['Scheduling Core', 'Patient Intake', 'Telemedicine Portals'],
    href: '/services/healthcare-software-development',
  },
  {
    verticalId: 'E-COMMERCE',
    title: 'Global E-Commerce Platforms',
    subtitle: 'High-volume storefronts, resilient backend architecture, complex inventory routing, and automated operational dashboards.',
    chips: ['Order Flow Engines', 'Fulfillment Dashboards', 'Payment Integrations'],
    href: '/services/ecommerce-development',
  },
  {
    verticalId: 'ENTERPRISE HRMS',
    title: 'Enterprise HRMS Automation',
    subtitle: 'Heavy-duty payroll calculations, GPS-based attendance mapping, shift scheduling, and comprehensive multi-location workforce management.',
    chips: ['Attendance Tracking', 'Payroll Pipelines', 'Approval Hierarchies'],
    href: '/services/custom-hrms-payroll-software',
  },
  {
    verticalId: 'CUSTOM SYSTEMS',
    title: 'Custom Business Systems',
    subtitle: 'Workflow portals, internal CRMs, reporting dashboards, approvals, and integrations shaped around your operating model.',
    chips: ['Internal Portals', 'Reporting Dashboards', 'Workflow Automation'],
    href: '/services/custom-business-systems',
  }
];

type IndustrialNiche = (typeof industrialNiches)[number];

export function WhatWeBuildSection({ niches = industrialNiches }: { niches?: IndustrialNiche[] }) {
  const chapterCount = niches.length + 1;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Transition Overlays
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const corePulseRef = useRef<HTMLDivElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  const performanceProfile = useDevicePerformanceProfile();
  const isMobilePremium = performanceProfile === 'mobilePremium';
  const activeFrames = isMobilePremium ? MOBILE_FRAME_PATHS : FRAME_PATHS;
  const activeTotalFrames = isMobilePremium ? MOBILE_TOTAL_FRAMES : TOTAL_FRAMES;
  const activeLengths = isMobilePremium ? MOBILE_INDIVIDUAL_LENGTHS : INDIVIDUAL_LENGTHS;

  const updateCinematicProgress = useCallback(({ frameProgress }: { frameProgress: number }) => {
    const progress = frameProgress;
    const globalFrame = Math.floor(progress * (activeTotalFrames - 1));
    let localFrame = globalFrame;
    let activeChap = 0;

    for (let i = 0; i < activeLengths.length; i += 1) {
      if (localFrame < activeLengths[i]) {
        activeChap = i;
        break;
      }
      localFrame -= activeLengths[i];
    }

    if (horizontalTrackRef.current) {
      gsap.set(horizontalTrackRef.current, {
        xPercent: -progress * (((chapterCount - 1) / chapterCount) * 100),
      });
    }

    const framesInChap = activeLengths[activeChap];
    const transitionWindow = isMobilePremium ? 6 : 14;
    const inTransition = activeChap < activeLengths.length - 1 && localFrame > framesInChap - transitionWindow;

    if (darkOverlayRef.current && blurOverlayRef.current && corePulseRef.current && canvasRef.current) {
      const transitionProgress = inTransition
        ? Math.max(0, localFrame - (framesInChap - transitionWindow)) / transitionWindow
        : 0;
      const curve = Math.sin(transitionProgress * Math.PI);

      gsap.set(darkOverlayRef.current, { opacity: curve * (isMobilePremium ? 0.32 : 0.45) });
      gsap.set(corePulseRef.current, {
        scale: 1 + curve * (isMobilePremium ? 0.06 : 0.1),
        opacity: 0.35 + curve * 0.2,
        rotate: curve * 90,
      });

      if (isMobilePremium) {
        gsap.set(blurOverlayRef.current, { opacity: curve * 0.3 });
        gsap.set(canvasRef.current, { scale: 1 + curve * 0.025 });
      } else {
        gsap.set(blurOverlayRef.current, { filter: `blur(${curve * 12}px)` });
        gsap.set(canvasRef.current, {
          scale: 1 + curve * 0.05,
          filter: `contrast(${1 + curve * 0.2}) saturate(${1 - curve * 0.4})`,
        });
      }
    }

    const focusIndexFloat = progress * (chapterCount - 1);

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const dist = Math.abs(focusIndexFloat - index);
      const activePower = Math.max(0, 1 - dist * 1.5);
      const cardBg = el.querySelector('.hud-glass-panel');

      gsap.set(el, {
        scale: 0.9 + 0.1 * activePower,
        rotateY: isMobilePremium ? 0 : (focusIndexFloat - index) * -8,
        opacity: 0.2 + 0.8 * activePower,
        ...(isMobilePremium ? {} : { filter: `blur(${6 * (1 - activePower)}px)` }),
        pointerEvents: activePower > 0.8 ? 'auto' : 'none',
        transformPerspective: 1200,
      });

      if (cardBg) {
        gsap.set(cardBg, { backgroundColor: `rgba(0, 0, 0, ${0.4 + 0.3 * (1 - activePower)})` });
      }
    });
  }, [activeLengths, activeTotalFrames, chapterCount, isMobilePremium]);

  useCinematicFrameStage({
    canvasRef,
    containerRef: sectionRef,
    frames: activeFrames,
    profile: performanceProfile,
    lazyStart: 'top 150%',
    scrub: isMobilePremium ? true : 1.5,
    preloadRadius: isMobilePremium ? 8 : undefined,
    onProgress: updateCinematicProgress,
  });

  useEffect(() => {
    // Spatial Pointer listener (Holographic effect)
    const handleMouseMove = (e: MouseEvent) => {
      if(performanceProfile !== 'desktop' || !stageContainerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 8; // gentle 8deg pivot
      const y = (e.clientY / window.innerHeight - 0.5) * -8;
      gsap.to(stageContainerRef.current, {
        rotateX: y,
        rotateY: x,
        duration: 1.5,
        ease: 'power2.out',
        transformPerspective: 1200
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [performanceProfile]);

  // --- HTML Assembly ---

  const sectionIntro = (
    <div className="w-full max-w-4xl px-6 text-center mx-auto flex flex-col items-center">
      <div className="pb-8">
        <span className="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.5em] text-teal block mb-8">
           OUR INDUSTRIAL NICHES
        </span>
        <h2 className="text-[clamp(3rem,6vw,6.5rem)] font-black font-[family-name:var(--font-outfit)] tracking-tight leading-[1]">
          <span className="text-white">Architecting </span>
          <br />
          <span className="bg-gradient-to-r from-teal via-white to-teal bg-clip-text text-transparent italic pr-4">Core Industries.</span>
        </h2>
      </div>
      <div className="w-full sm:w-[80%] max-w-2xl p-5 sm:p-8 lg:p-12 bg-black/40 backdrop-blur-2xl border border-white/5 shadow-[0_0_80px_rgba(20,184,166,0.1)] relative overflow-hidden flex flex-col items-center">
        {/* Optical Center Beams */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        
        <p className="text-white/80 text-xl sm:text-2xl font-light leading-relaxed relative z-10 text-center">
          We build websites, platforms, and digital systems custom-engineered to dominate your specific market.
        </p>
      </div>
    </div>
  );

  const specializedHUDs = niches.map((niche, idx) => (
    <div key={idx} className="w-full max-w-3xl px-4 sm:px-8 xl:px-0 mx-auto relative group">
      
      <div className="pb-4 sm:pb-8 flex flex-col gap-2 sm:gap-4">
        {/* Massive Tactical Badge */}
        <div className="inline-flex">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-teal bg-teal/10 px-3 py-1.5 sm:px-5 sm:py-2.5 border border-teal/20 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.15)] flex items-center gap-3">
             <div className="w-2 h-2 bg-teal shadow-[0_0_10px_teal] animate-pulse" />
	             [ {String(idx + 1).padStart(2, '0')} VERTICAL: {niche.verticalId} ]
           </span>
        </div>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black font-[family-name:var(--font-outfit)] text-white leading-tight pr-4">
          {niche.title}
        </h2>
      </div>
      
      {/* HUD Glass Panel */}
      <div className="hud-glass-panel w-full p-5 sm:p-8 lg:p-12 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col gap-5 sm:gap-8 lg:gap-10 relative overflow-hidden group hover:border-teal/30 transition-colors duration-500 rounded-sm">
        
        {/* Tactical Outer Crosshairs */}
        <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        <div className="absolute top-0 left-0 w-[2px] h-8 bg-primary shadow-[0_0_15px_#2dd4bf]" />
        <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-primary shadow-[0_0_15px_#2dd4bf]" />
        
        {/* Scanline Interface grid */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.04] bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px]" />
        
        <p className="text-white/90 text-[1.15rem] sm:text-xl xl:text-3xl font-light leading-relaxed relative z-10 transition-colors group-hover:text-white">
          {niche.subtitle}
        </p>
        
        {/* Modular Chips */}
        <div className="flex flex-wrap gap-3 relative z-10">
           {niche.chips.map((chip, cIdx) => (
              <span key={cIdx} className="px-5 py-2.5 bg-black/50 border border-white/20 text-xs sm:text-[13px] font-mono tracking-widest text-white/60 backdrop-blur-md transition-colors shadow-inner group-hover:text-primary group-hover:bg-primary/5">
                 {chip}
              </span>
           ))}
        </div>

        <div className="pt-4 relative z-10">
          <Button
            label={`Intercept ${niche.verticalId} System`}
            href={niche.href}
            variant="primary"
            icon="arrow"
            size="large"
            className="shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)] w-full sm:w-auto hover:shadow-[0_0_60px_-10px_rgba(20,184,166,0.5)] transition-shadow duration-500 text-sm font-bold tracking-widest uppercase"
          />
        </div>
      </div>
    </div>
  ));

  const trackNodes = [sectionIntro, ...specializedHUDs];

  if (performanceProfile === 'reducedMotion') {
    return (
      <section className="relative w-full bg-black py-24 px-6 space-y-32">
        {sectionIntro}
        <div className="max-w-4xl mx-auto space-y-24">
          {specializedHUDs.map((node, idx) => (
            <div key={idx} className="w-full pointer-events-auto">
              {node}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white"
      style={{ height: `${Math.max(chapterCount, 2) * 160}vh` }}
    >
      
      {/* Fixed Full-Screen Viewport Window */}
      <div className="sticky top-0 z-0 h-screen w-screen overflow-hidden bg-[#000]">
        
        {/* 1. Master Canvas Spatial Anchor (100vw x 100vh) */}
        <div ref={stageContainerRef} className="absolute inset-0 w-full h-full [transform-style:preserve-3d]">
            
            {/* The Architect's Dial Array */}
            <div ref={corePulseRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 mix-blend-screen -z-10">
               <svg className="w-[140vw] max-w-[1200px] aspect-square animate-spin [animation-duration:50s] opacity-20" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                  <circle cx="50" cy="50" r="48" stroke="#14b8a6" strokeWidth="0.1" strokeDasharray="1 3" />
                  <circle cx="50" cy="50" r="40" stroke="#14b8a6" strokeWidth="0.3" strokeDasharray="5 5" />
                  <circle cx="50" cy="50" r="30" stroke="#14b8a6" strokeWidth="0.1" />
                  <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.05" strokeDasharray="2 2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#14b8a6" strokeWidth="0.05" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#14b8a6" strokeWidth="0.05" />
               </svg>
            </div>
            
            {/* Massive Fullscreen Frame Render */}
            <canvas ref={canvasRef} className="relative z-10 w-full h-full object-cover origin-center opacity-80" style={{ willChange: isMobilePremium ? 'transform' : 'transform, filter' }} />
        </div>

        {/* Universal Cinematic Overlays */}
        <div ref={blurOverlayRef} className="absolute z-20 inset-0 w-full h-full bg-teal/10 opacity-0 pointer-events-none" style={{ willChange: isMobilePremium ? 'opacity' : 'filter' }} />
        <div ref={darkOverlayRef} className="absolute z-20 inset-0 w-full h-full bg-black/60 opacity-0 pointer-events-none" style={{ willChange: 'opacity' }} />
        <div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.95)_100%)] pointer-events-none mix-blend-multiply" />
        
        
        {/* 2. THE HORIZONTAL GSAP TRACK (500vw) */}
        <div
          ref={horizontalTrackRef}
          className="absolute z-40 top-0 left-0 h-full flex flex-row items-center pointer-events-none"
          style={{ width: `${chapterCount * 100}vw`, willChange: 'transform' }}
        >
            
            {trackNodes.map((node, idx) => (
                <div 
                  key={idx}
                  ref={el => { cardRefs.current[idx] = el; }}
                  className="w-[100vw] h-full flex flex-col items-center justify-center px-4"
                >
                   {node}
                </div>
            ))}

        </div>
        
        {/* Locked Cinematic Borders Overlaying the Track */}
        <div className="absolute z-50 top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent pointer-events-none opacity-80" />
        <div className="absolute z-50 bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none opacity-80" />

      </div>
    </section>
  );
}
