'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Intentionally ignoring props to maintain architectural content strictness
interface WhatWeBuildSectionProps {}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Explicit Core Industrial Niches explicitly requested by user (Leading intensely with Healthcare)
const industrialNiches = [
  {
    verticalId: 'HEALTHCARE',
    title: 'Healthcare Operating Systems',
    subtitle: 'Complete EHR integrations, intelligent appointment engines, HIPAA-compliant storage, and multi-location clinic coordination architecture.',
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
    verticalId: 'SYSTEM SOFTWARE',
    title: 'Custom Hardware & Portals',
    subtitle: 'Deep integration architecture. From embedded machinery dashboards (Semiconductor interfaces) to massive bespoke CRM structures.',
    chips: ['Hardware Interfaces', 'Internal Portals', 'Legacy System APIs'],
    href: '/contact',
  }
];

export function WhatWeBuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Transition Overlays
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const corePulseRef = useRef<HTMLDivElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  const imageCache = useRef<Record<number, HTMLImageElement[]>>({});
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // DPR-aware scaling for crispness
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const loadChapterImages = (idx: number) => {
      if (idx < 0 || idx >= 5) return;
      if (imageCache.current[idx]) return; 

      imageCache.current[idx] = [];
      
      let baseOffset = 0;
      for (let i = 0; i < idx; i++) {
        baseOffset += INDIVIDUAL_LENGTHS[i];
      }
      
      for (let i = 0; i < INDIVIDUAL_LENGTHS[idx]; i++) {
        const img = new Image();
        img.src = FRAME_PATHS[baseOffset + i];
        imageCache.current[idx][i] = img;
        
        img.decode().catch(() => {});
        if (idx === 0 && i === 0) {
          img.onload = () => {
             const progress = ScrollTrigger.getById('horizontal360Engine')?.progress || 0;
             if(Math.round(progress) === 0) {
                 renderToCanvas(img);
             }
          };
        }
      }
    };

    const unloadChapterImages = (idx: number) => {
      if (idx < 0 || idx >= 5) return;
      if (!imageCache.current[idx]) return;
      imageCache.current[idx].forEach(img => { if (img) img.src = ''; });
      delete imageCache.current[idx];
    };

    const renderToCanvas = (img: HTMLImageElement) => {
      const hRatio = displayWidth / img.width;
      const vRatio = displayHeight / img.height;
      const ratio = Math.max(hRatio, vRatio); // Object-cover calculation
      const cx = (displayWidth - img.width * ratio) / 2;
      const cy = (displayHeight - img.height * ratio) / 2;

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    };

    // Lazy load: only start loading when section is entering viewport
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 150%',
      onEnter: () => {
        loadChapterImages(0);
        loadChapterImages(1);
      },
      once: true
    });

    // Spatial Pointer listener (Holographic effect)
    const handleMouseMove = (e: MouseEvent) => {
      if(window.innerWidth < 1024 || !stageContainerRef.current) return;
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

    const matchMedia = gsap.matchMedia();
    matchMedia.add("(min-width: 320px)", () => {
      ScrollTrigger.create({
        id: 'horizontal360Engine',
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1
          const isMobile = window.innerWidth < 1024;
          
          // --- 1. Horizontal Tracking Math ---
          // Container is 500vw total (Intro + 4 Cards). We translate it -400vw across progress exactly.
          if (horizontalTrackRef.current) {
             // Use xPercent instead of vw for better mobile/Safari stability
             gsap.set(horizontalTrackRef.current, { xPercent: -progress * 80 }); 
          }

          // --- 2. Master Canvas Frame Scrubbing ---
          const cFrameGlobal = Math.floor(progress * (TOTAL_FRAMES - 1));
          let localFrame = cFrameGlobal;
          let activeChap = 0;
          for (let i = 0; i < 5; i++) {
            if (localFrame < INDIVIDUAL_LENGTHS[i]) {
              activeChap = i;
              break;
            }
            localFrame -= INDIVIDUAL_LENGTHS[i];
          }

          loadChapterImages(activeChap);
          loadChapterImages(activeChap + 1);
          
          if (isMobile) {
            unloadChapterImages(activeChap - 2);
            unloadChapterImages(activeChap + 2);
          } else {
            unloadChapterImages(activeChap - 3);
            unloadChapterImages(activeChap + 3);
          }

          const activeImg = imageCache.current[activeChap]?.[localFrame];
          if (activeImg && activeImg.complete && activeImg.naturalHeight > 0) {
            renderToCanvas(activeImg);
          }

          // --- 3. Cinematic Reconfiguration Transitions ---
          const framesInChap = INDIVIDUAL_LENGTHS[activeChap];
          const TRANSITION_WINDOW = 14; 
          const inTransition = activeChap < 4 && localFrame > framesInChap - TRANSITION_WINDOW;
          
          if (darkOverlayRef.current && blurOverlayRef.current && corePulseRef.current && canvasRef.current) {
             const tProgress = inTransition ? Math.max(0, localFrame - (framesInChap - TRANSITION_WINDOW)) / TRANSITION_WINDOW : 0;
             const curve = Math.sin(tProgress * Math.PI); 

             gsap.set(darkOverlayRef.current, { opacity: curve * 0.45 });
             gsap.set(blurOverlayRef.current, { filter: `blur(${curve * 12}px)` });
             gsap.set(corePulseRef.current, { scale: 1 + (curve * 0.1), opacity: 0.35 + (curve * 0.2), rotate: curve * 90 });
             
             // Lens Distortion Effect
             gsap.set(canvasRef.current, { scale: 1 + (curve * 0.05), filter: `contrast(${1 + curve * 0.2}) saturate(${1 - curve * 0.4})` });
          }

          // --- 4. Micro-Interactions on the Hovering HUD Nodes ---
          const focusIndexFloat = progress * 4; 
          
          cardRefs.current.forEach((el, index) => {
            if (!el) return;
            const dist = Math.abs(focusIndexFloat - index);
            const activePower = Math.max(0, 1 - dist * 1.5); // Math distance power
            const cardBg = el.querySelector('.hud-glass-panel');

            // Scale and perspective physics as they slide past the camera center
            gsap.set(el, {
              scale: 0.90 + (0.10 * activePower),
              rotateY: (focusIndexFloat - index) * -8, // Slight 3D tilt as they pass horizontally
              opacity: 0.20 + (0.80 * activePower),
              filter: `blur(${6 * (1 - activePower)}px)`,
              pointerEvents: activePower > 0.8 ? 'auto' : 'none',
              transformPerspective: 1200,
              ease: 'power1.out',
            });
            
            // Intensify glass brightness when squarely in center
            if (cardBg) {
               gsap.set(cardBg, { backgroundColor: `rgba(0, 0, 0, ${0.4 + (0.3 * (1 - activePower))})` });
            }
          });
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getById('horizontal360Engine')?.kill();
      Object.keys(imageCache.current).forEach(key => {
        unloadChapterImages(parseInt(key));
      });
    };
  }, []);

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
      <div className="w-full sm:w-[80%] max-w-2xl p-8 lg:p-12 bg-black/40 backdrop-blur-2xl border border-white/5 shadow-[0_0_80px_rgba(20,184,166,0.1)] relative overflow-hidden flex flex-col items-center">
        {/* Optical Center Beams */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-primary shadow-[0_0_15px_#2dd4bf]" />
        
        <p className="text-white/80 text-xl sm:text-2xl font-light leading-relaxed relative z-10 text-center">
          We build websites, platforms, and digital systems custom-engineered to dominate your specific market.
        </p>
      </div>
    </div>
  );

  const specializedHUDs = industrialNiches.map((niche, idx) => (
    <div key={idx} className="w-full max-w-3xl px-4 sm:px-8 xl:px-0 mx-auto relative group">
      
      <div className="pb-8 flex flex-col gap-4">
        {/* Massive Tactical Badge */}
        <div className="inline-flex">
           <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-teal bg-teal/10 px-5 py-2.5 border border-teal/20 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.15)] flex items-center gap-3">
             <div className="w-2 h-2 bg-teal shadow-[0_0_10px_teal] animate-pulse" />
             [ {String(idx + 1).padStart(2, '0')} // VERTICAL: {niche.verticalId} ]
           </span>
        </div>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black font-[family-name:var(--font-outfit)] text-white leading-tight pr-4">
          {niche.title}
        </h2>
      </div>
      
      {/* HUD Glass Panel */}
      <div className="hud-glass-panel w-full p-8 lg:p-12 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col gap-8 lg:gap-10 relative overflow-hidden group hover:border-teal/30 transition-colors duration-500 rounded-sm">
        
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

  if (prefersReducedMotion) {
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
    <section ref={sectionRef} className="relative h-[800vh] w-full bg-black text-white">
      
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
            <canvas ref={canvasRef} className="relative z-10 w-full h-full object-cover origin-center opacity-80" style={{ willChange: 'transform, filter' }} />
        </div>

        {/* Universal Cinematic Overlays */}
        <div ref={blurOverlayRef} className="absolute z-20 inset-0 w-full h-full backdrop-blur-[0px] pointer-events-none" style={{ willChange: 'backdrop-filter' }} />
        <div ref={darkOverlayRef} className="absolute z-20 inset-0 w-full h-full bg-black/60 opacity-0 pointer-events-none" style={{ willChange: 'opacity' }} />
        <div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.95)_100%)] pointer-events-none mix-blend-multiply" />
        
        
        {/* 2. THE HORIZONTAL GSAP TRACK (500vw) */}
        <div ref={horizontalTrackRef} className="absolute z-40 top-0 left-0 h-full w-[500vw] flex flex-row items-center pointer-events-none" style={{ willChange: 'transform' }}>
            
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
