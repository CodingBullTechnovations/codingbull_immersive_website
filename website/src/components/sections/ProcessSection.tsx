'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProcessStep } from '@/types/content';

gsap.registerPlugin(ScrollTrigger);

// Module-level constant — never recreated between renders (fixes useEffect deps bug)
const SEMICONDUCTOR_FRAMES = Array.from({ length: 240 }, (_, i) => 
  `/images/semiconductorframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
);

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || SEMICONDUCTOR_FRAMES.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Use lower resolution on mobile to guarantee memory safety
    const isMobile = window.innerWidth < 1024;
    canvas.width = isMobile ? 1280 : 1920;
    canvas.height = isMobile ? 720 : 1080;

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    SEMICONDUCTOR_FRAMES.forEach((src: string, index: number) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (index === 0 && context) {
          renderFrame(img);
        }
        if (loadedCount === SEMICONDUCTOR_FRAMES.length) {
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    });

    function renderFrame(img: HTMLImageElement) {
      if (!context || !canvas) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }

    let ctx = gsap.context(() => {
      const playhead = { frame: 0 };
      
      // Map the 240 frames accurately to the scroll distance of the entire section
      gsap.to(playhead, {
        frame: SEMICONDUCTOR_FRAMES.length - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // 0.5s scrub delay for smoothness
        },
        onUpdate: () => {
          if (loadedImages[playhead.frame]) {
            renderFrame(loadedImages[playhead.frame]);
          }
        },
      });

      // Simple fade-in animation for each card as it enters the viewport
      textRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });
      
    }, containerRef);

    return () => {
      ctx.revert();
      loadedImages.forEach(img => { img.src = ''; });
    };
  }, []);  // SEMICONDUCTOR_FRAMES is module-level constant, no deps needed

  return (
    <section ref={containerRef} className="relative w-full bg-black">
      
      {/* Sticky Background Canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute w-full h-full object-cover origin-center opacity-70 mix-blend-screen" />
        
        {/* Loading overlay for the sequence frames */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/98 z-30 transition-opacity duration-1000">
            <span className="text-teal/60 text-[11px] tracking-[0.4em] font-medium uppercase animate-pulse">
              Loading Process Simulation...
            </span>
          </div>
        )}

        {/* Cinematic overlays to match site aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter2%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter2)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Scrolling Content overlaid safely on top */}
      <div className="relative z-10 w-full max-w-[var(--max-w-content)] mx-auto px-6 pb-[20vh] -mt-[100vh]">
        
        {/* Section Header */}
        <div className="pt-32 pb-40 text-center pointer-events-none">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal block mb-3">
            Business Process Automation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
            <span className="text-white">How We </span>
            <span className="bg-gradient-to-r from-teal to-white bg-clip-text text-transparent">Engineer It</span>
          </h2>
        </div>

        {/* The 5 standard native scrolling Steps spread out with vertical spacing */}
        <div className="flex flex-col gap-[35vh]">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              ref={el => { textRefs.current[idx] = el; }}
              className="w-full lg:max-w-xl mx-auto lg:mx-0 lg:ml-auto" 
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="w-full bg-black/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(20,184,166,0.15)] relative group transition-transform duration-500 hover:scale-[1.02] hover:border-teal/30">
                
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 relative z-10">
                  {/* Step Number Badge */}
                  <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl border border-teal/40 bg-teal/10 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                    <span className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {step.number.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  {/* Step Content */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-outfit)] text-white mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer at bottom so last item finishes scrolling out of center cleanly */}
        <div className="h-[30vh]" />
      </div>

    </section>
  );
}
