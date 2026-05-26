'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { HeroContent } from '@/types/content';
import { MultiFrameHero } from '@/components/animations/MultiFrameHero';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  // Section 1: Intro (80 frames)
  const introFrames = Array.from({ length: 80 }, (_, i) => 
    `/images/heroframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
  );

  // Section 2: Healthcare (80 frames)
  const healthcareFrames = Array.from({ length: 80 }, (_, i) => 
    `/images/healthcarejpgframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
  );

  // Section 3: E-Commerce (64 frames)
  const ecomFrames = Array.from({ length: 64 }, (_, i) => 
    `/images/e-commercejpgFrames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
  );

  // Section 4: Enterprise HRMS (80 frames)
  const hrmsFrames = Array.from({ length: 80 }, (_, i) => 
    `/images/hrmsjpgframes/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
  );

  // Section 5: CTA (80 frames)
  // Using the final frames of the original hero sequence
  const ctaFrames = Array.from({ length: 80 }, (_, i) => 
    `/images/heroframes/ezgif-frame-${String(161 + i).padStart(3, '0')}.jpg`
  );

  // Combine into a 384-frame master sequence
  const frames = [
    ...introFrames,
    ...healthcareFrames,
    ...ecomFrames,
    ...hrmsFrames,
    ...ctaFrames,
  ];

  const section1 = (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto pb-32 px-4 max-w-5xl mx-auto">
      <h1 className="hero-anim-item text-[clamp(2.5rem,6vw,5rem)] text-center font-bold font-[family-name:var(--font-outfit)] leading-[1.05] tracking-[0.1em] mb-4 uppercase text-white">
        Coding<span className="text-teal">Bull</span> <br />Technovations
      </h1>
      <p className="hero-anim-item text-white/50 tracking-[0.2em] text-[10px] sm:text-xs uppercase mb-3">
        Pvt. Ltd. • Premium Enterprise Architecture
      </p>
      
      {/* Premium GSTIN Badge */}
      <div className="hero-anim-item inline-flex items-center gap-2 px-3 py-1.5 bg-teal/10 border border-teal/20 rounded-md backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        <span className="text-[10px] sm:text-[11px] font-mono text-teal tracking-widest uppercase">
          GSTIN: <span className="font-bold text-white">24AAMCC7617E1ZP</span>
        </span>
      </div>
    </div>
  );

  const section2 = (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto px-4 max-w-5xl mx-auto text-center">
      <div className="hero-anim-item">
        <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.4em] text-teal block mb-4">
          Brand Promise
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black font-[family-name:var(--font-outfit)] text-white mb-8">
          Custom Digital Systems
        </h2>
      </div>
      <div className="hero-anim-item w-full max-w-2xl p-8 sm:p-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] mx-auto">
        <p className="text-white/80 text-lg sm:text-xl font-light leading-relaxed">
          From clinic websites to enterprise platforms — we design, build, and ship custom digital systems engineered precisely for your operational complexity.
        </p>
      </div>
    </div>
  );

  const section3 = (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto px-4 max-w-5xl mx-auto text-center">
      <div className="hero-anim-item">
        <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.4em] text-teal block mb-4">
          Core Philosophy
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black font-[family-name:var(--font-outfit)] text-white mb-8">
          Built For Operations
        </h2>
      </div>
      <div className="hero-anim-item w-full max-w-2xl p-8 sm:p-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] mx-auto">
        <p className="text-white/80 text-lg sm:text-xl font-light leading-relaxed">
          We don&apos;t use generic templates. Every line of code is structured organically around how your business naturally operates, scales, and generates revenue.
        </p>
      </div>
    </div>
  );

  const section4 = (
    <div className="flex flex-col items-center justify-center h-full w-full pointer-events-auto px-4 max-w-5xl mx-auto text-center">
      <div className="hero-anim-item">
        <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.4em] text-teal block mb-4">
          Absolute Coverage
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black font-[family-name:var(--font-outfit)] text-white mb-8">
          End-to-End Capabilities
        </h2>
      </div>
      <div className="hero-anim-item w-full max-w-2xl p-8 sm:p-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] mx-auto">
        <p className="text-white/80 text-lg sm:text-xl font-light leading-relaxed">
          From deep backend logic to high-performance user interfaces, we deliver comprehensive digital dominance that outpaces the market.
        </p>
      </div>
    </div>
  );

  const section5 = (
    <div className="flex flex-col items-center justify-center sm:justify-end pb-10 sm:pb-32 h-full w-full pointer-events-auto px-4">
      <div className="hero-anim-item relative z-20 w-full max-w-4xl mx-auto p-8 sm:p-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] text-center shadow-[0_0_80px_-20px_rgba(20,184,166,0.2)]">
        
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold font-[family-name:var(--font-outfit)] leading-[1.05] tracking-[-0.02em] mb-8">
          <span className="text-white">Ready To Transform Your </span>
          <span className="bg-gradient-to-r from-teal via-white to-teal bg-clip-text text-transparent">Digital Presence?</span>
        </h2>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-6 sm:mt-10">
          <Button
            label={content.primaryCTA.label}
            href={content.primaryCTA.href}
            variant={content.primaryCTA.variant}
            icon={content.primaryCTA.icon}
            trackingSource={content.primaryCTA.trackingSource}
            size="large"
            className="shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_-10px_rgba(20,184,166,0.5)] transition-shadow duration-500"
          />
          <Button
            label={content.secondaryCTA.label}
            href={content.secondaryCTA.href}
            variant={content.secondaryCTA.variant}
            icon={content.secondaryCTA.icon}
            trackingSource={content.secondaryCTA.trackingSource}
            size="large"
            className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
          />
        </div>
      </div>
    </div>
  );

  return (
    <MultiFrameHero 
      frames={frames}
      textSections={[section1, section2, section3, section4, section5]}
      weights={[80, 80, 64, 80, 80]} // Dynamically synced strictly to array lengths
      scrollHeight="800vh" // Drastically slows down the scroll based on feedback
    >
      {/* Scroll hint absolute at bottom of container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-semibold bg-gradient-to-r from-teal to-white bg-clip-text text-transparent opacity-80 animate-pulse">
            Scroll To Initialize
          </span>
          <div className="w-6 h-10 rounded-full border border-teal/40 shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-start justify-center p-1.5 overflow-hidden">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-2.5 bg-teal rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </MultiFrameHero>
  );
}
