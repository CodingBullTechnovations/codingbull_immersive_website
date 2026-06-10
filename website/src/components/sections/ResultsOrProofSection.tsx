'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProofMetric } from '@/types/content';

function AnimatedCounter({ value, isInView }: { value: string; isInView: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);
  const shouldReduceMotion = useReducedMotion();
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!isInView || target === 0 || shouldReduceMotion) {
      return;
    }

    const duration = 2000;
    const startTime = performance.now();
    let animationFrame = 0;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(`${Math.floor(target * ease)}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, shouldReduceMotion, suffix, target, value]);

  return (
    <span aria-label={value}>
      <span aria-hidden="true">{displayValue}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

interface ResultsOrProofSectionProps {
  metrics: ProofMetric[];
}

export function ResultsOrProofSection({ metrics }: ResultsOrProofSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[var(--max-w-content)] mx-auto">
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal/60 block mb-4">
            Verified Results
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-5">
            <span className="text-white">Real Work. </span>
            <span className="bg-gradient-to-r from-teal to-[#5aeacc] bg-clip-text text-transparent">Real Systems.</span>
          </h2>
        <p className="text-white/70 text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-light">
          We measure success by systems that actually run businesses — not by vanity metrics.
        </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={false}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group text-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-8 lg:p-10 transition-all duration-500 hover:border-teal/10 hover:bg-white/[0.04]"
            >
              <div className="break-words text-xl font-bold leading-tight bg-gradient-to-b from-teal to-teal/60 bg-clip-text text-transparent font-[family-name:var(--font-outfit)] mb-3 transition-all group-hover:from-teal group-hover:to-[#5aeacc] sm:text-3xl lg:text-4xl">
                <AnimatedCounter value={metric.value} isInView={isInView} />
              </div>
              <div className="text-sm font-medium text-white/60 mb-1">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-[11px] text-white/60 font-light">
                  {metric.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
