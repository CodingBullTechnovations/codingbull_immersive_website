'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import type { CTAConfig } from '@/types/content';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  cta: CTAConfig;
}

export function CTASection({ cta }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !contentRef.current) return;

    let ctx = gsap.context(() => {
      // Slight parallax on background image
      gsap.to(bgRef.current, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', // Start when section enters bottom of viewport
          end: 'bottom top',   // End when section leaves top of viewport
          scrub: true,
        },
      });

      // Simple fade up for CTA content when it enters view
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%', // Trigger when section is 80% into view
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative flex items-center justify-center min-h-[80vh] py-28 lg:py-36 px-6 lg:px-10 overflow-hidden bg-black"
    >
      {/* Deep Space Black Premium Gradient */}
      <div 
        ref={bgRef} 
        className="absolute inset-x-0 -top-[10%] -bottom-[10%] w-full will-change-transform z-0 bg-black"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[var(--max-w-narrow)] mx-auto text-center" ref={contentRef}>
        {/* Subtle Branding */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] pointer-events-none">
          <Image src="/images/logo/logo.png" alt="" fill sizes="200px" className="object-cover" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-[1.1] mb-6">
          <span className="text-white">Ready to Build </span>
          <br className="hidden sm:block" />
          <span className="text-white">Your </span>
          <span className="bg-gradient-to-r from-teal to-white bg-clip-text text-transparent">Website</span>
          <span className="text-white">?</span>
        </h2>

        <p className="text-base lg:text-lg text-white/40 mb-12 max-w-lg mx-auto leading-relaxed font-light">
          Tell us what your business needs. Get a fixed-price quote with a clear scope and timeline — no surprises, no hourly billing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            label={cta.label}
            href={cta.href}
            variant="primary"
            icon="whatsapp"
            trackingSource={cta.trackingSource}
            size="large"
          />
          <Button
            label="View Case Studies"
            href="/case-studies"
            variant="secondary"
            icon="arrow"
            trackingSource="final_cta_secondary"
            size="large"
          />
        </div>

        <p className="mt-8 text-[11px] text-white/20 font-medium tracking-wide uppercase">
          Response within 24 hours · Fixed-price quotes · No obligation
        </p>
      </div>
    </section>
  );
}
