'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface MultiFrameHeroProps {
  frames: string[];
  children?: React.ReactNode;
  textSections?: React.ReactNode[];
  weights?: number[];
  scrollHeight?: string; // e.g. '500vh', '800vh' to control animation speed
}

export function MultiFrameHero({ frames, children, textSections, weights, scrollHeight = '500vh' }: MultiFrameHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || frames.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // DPR-aware scaling for sharpness
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    context.scale(dpr, dpr);

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    frames.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (index === 0 && context) {
          renderFrame(img);
        }
        if (loadedCount === frames.length) {
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    });

    function renderFrame(img: HTMLImageElement) {
      if (!context || !canvas) return;
      const hRatio = displayWidth / img.width;
      const vRatio = displayHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (displayWidth - img.width * ratio) / 2;
      const centerShift_y = (displayHeight - img.height * ratio) / 2;

      context.clearRect(0, 0, displayWidth, displayHeight);
      context.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };

      if (prefersReducedMotion) {
        // If reduced motion is preferred, just render the first frame and skip scrub
        if (loadedImages[0]) renderFrame(loadedImages[0]);
        return;
      }

      // NO pin: true — uses natural scroll height
      gsap.to(playhead, {
        frame: frames.length - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
        onUpdate: () => {
          if (loadedImages[playhead.frame]) {
            renderFrame(loadedImages[playhead.frame]);
          }
        },
      });

      // Parallax zoom on canvas
      if (canvasRef.current) {
        gsap.fromTo(canvasRef.current,
          { scale: 1 },
          {
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.5,
            },
          }
        );
      }

      // Text section cross-fading
      if (textSections && textSections.length > 0) {
        const numSections = textSections.length;
        const activeWeights = weights && weights.length === numSections ? weights : Array(numSections).fill(1);
        const totalWeight = activeWeights.reduce((acc: number, w: number) => acc + w, 0);

        // Initialize states
        textRefs.current.forEach((el, i) => {
          if (!el) return;
          const items = el.querySelectorAll('.hero-anim-item');

          if (i === 0) {
            gsap.set(el, { opacity: 1, pointerEvents: 'auto' });
            gsap.set(items, { opacity: 1, filter: 'blur(0px)', scale: 1, rotateX: 0, z: 0 });
          } else {
            gsap.set(el, { opacity: 0, pointerEvents: 'none' });
            gsap.set(items, { opacity: 0, filter: 'blur(15px)', scale: 0.5, rotateX: 45, z: -500 });
          }
        });

        // Build a timeline NOT attached to pin — uses the container's natural scroll height
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });

        textRefs.current.forEach((el, i) => {
          if (!el) return;
          const items = el.querySelectorAll('.hero-anim-item');

          const weightBefore = activeWeights.slice(0, i).reduce((acc: number, w: number) => acc + w, 0);
          const startTime = weightBefore / totalWeight;
          const sectionDuration = activeWeights[i] / totalWeight;
          // Slight overlap ensures 1 section fades out right as the other triggers
          const endTime = startTime + sectionDuration;

          if (i !== 0) {
            tl.set(el, { pointerEvents: 'auto' }, startTime);
            tl.to(el, { opacity: 1, duration: sectionDuration * 0.1 }, startTime);

            tl.to(items, {
              opacity: 1,
              scale: 1,
              rotateX: 0,
              z: 0,
              filter: 'blur(0px)',
              stagger: 0.05,
              duration: sectionDuration * 0.45,
              ease: 'back.out(1.5)'
            }, startTime);
          }

          if (i !== numSections - 1) {
            tl.to(items, {
              opacity: 0,
              scale: 1.5,
              rotateX: -45,
              z: 500,
              filter: 'blur(20px)',
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
      loadedImages.forEach(img => { img.src = ''; });
    };
  }, [frames, textSections, weights]);

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
                className="absolute inset-0 w-full h-full px-4 pt-32 pb-24 mx-auto max-w-[90rem] sm:px-6 lg:px-8 pointer-events-none flex flex-col items-center justify-center"
                style={{ willChange: 'opacity', perspective: '1000px' }}
              >
                {section}
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={textContainerRef}
            className="relative z-30 flex flex-col items-start justify-center w-full h-full px-4 pt-32 pb-24 mx-auto max-w-7xl sm:px-6 lg:px-8 pointer-events-none"
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
