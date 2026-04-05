'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Only run on desktop
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    if (!cursorRef.current || !dotRef.current) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;

    // We use quickTo for extreme performance (it creates a reusable animation function)
    const xMoveCursor = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
    const yMoveCursor = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });
    
    const xMoveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const yMoveDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      xMoveCursor(e.clientX);
      yMoveCursor(e.clientY);
      xMoveDot(e.clientX);
      yMoveDot(e.clientY);
    };

    // Handle magnetic hover links/buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        gsap.to(cursor, {
          scale: 1.5,
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          borderColor: 'rgba(45, 212, 191, 0.5)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (prefersReducedMotion) return null;

  // Hidden on mobile via CSS (hidden md:block)
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-white/20 rounded-full pointer-events-none z-[99] hidden md:block" 
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1 h-1 -ml-[2px] -mt-[2px] bg-white rounded-full pointer-events-none z-[99] hidden md:block mix-blend-difference" 
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
