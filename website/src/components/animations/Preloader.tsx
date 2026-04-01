'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // We only want the preloader on initial home load ideally,
    // but running it once per full refresh is standard.
    if (isComplete) return;

    // document.body.style.overflow = 'hidden';

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          // document.body.style.overflow = '';
        },
      });

      // Progress bar animation
      tl.to(
        progressRef.current,
        {
          width: '100%',
          duration: 1.5,
          ease: 'power2.inOut',
        },
        0
      );

      // Loading text animation
      tl.to(
        textRef.current,
        {
          opacity: 0,
          y: -10,
          duration: 0.5,
          delay: 1.2,
        },
        0
      );

      // Slide up the entire container
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        1.5
      );
    });

    return () => {
      ctx.revert();
    };
  }, [isComplete]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="relative w-32 h-32 mb-8 animate-pulse">
        <Image src="/images/logo/logo.png" alt="CodingBull" fill sizes="128px" className="object-contain" priority />
      </div>

      <div className="w-64 h-px bg-white/10 relative overflow-hidden">
        <div ref={progressRef} className="absolute left-0 top-0 bottom-0 w-0 bg-teal" />
      </div>

      <div className="mt-4 overflow-hidden h-6">
        <span ref={textRef} className="block text-xs tracking-[0.3em] font-medium text-white/50 uppercase">
          Initializing System
        </span>
      </div>
    </div>
  );
}
