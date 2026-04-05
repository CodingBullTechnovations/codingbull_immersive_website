'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  accentColor?: string; // e.g. 'teal', 'violet', 'amber'
}

const ACCENT_GRADIENTS: Record<string, { from: string; to: string; glow: string }> = {
  teal: { from: '#2dd4bf', to: '#a7dcf4', glow: 'rgba(45,212,191,0.15)' },
  violet: { from: '#8b5cf6', to: '#c4b5fd', glow: 'rgba(139,92,246,0.15)' },
  amber: { from: '#f59e0b', to: '#fcd34d', glow: 'rgba(245,158,11,0.15)' },
  rose: { from: '#f43f5e', to: '#fda4af', glow: 'rgba(244,63,94,0.15)' },
  sky: { from: '#0ea5e9', to: '#7dd3fc', glow: 'rgba(14,165,233,0.15)' },
};

export function PageHero({ title, subtitle, badge, accentColor = 'teal' }: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const accent = ACCENT_GRADIENTS[accentColor] || ACCENT_GRADIENTS.teal;

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle parallax on background — NO pin
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated Background */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        {/* Primary radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent.glow}, transparent 70%)` }}
        />
        {/* Secondary accent orb */}
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: accent.from }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${accent.from}20 1px, transparent 1px), linear-gradient(90deg, ${accent.from}20 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[10%] w-20 h-20 border border-white/[0.06] rounded-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent.from}08, transparent)` }}
      />
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[25%] right-[15%] w-16 h-16 border border-white/[0.04] rounded-full pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent.from}06, transparent)` }}
      />
      <motion.div
        animate={{ y: [-5, 15, -5], x: [-5, 5, -5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] right-[8%] w-3 h-3 rounded-full pointer-events-none"
        style={{ background: accent.from, opacity: 0.3, boxShadow: `0 0 30px ${accent.glow}` }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32 lg:py-40"
      >
        {badge && (
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-[0.25em] backdrop-blur-md"
              style={{
                borderColor: `${accent.from}30`,
                background: `${accent.from}10`,
                color: accent.from,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: accent.from }}
              />
              {badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-white">{title.split(' ').slice(0, -1).join(' ')} </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
          >
            {title.split(' ').slice(-1)[0]}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          variants={itemVariants}
          className="mt-10 mx-auto w-16 h-[2px] rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.from}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}
