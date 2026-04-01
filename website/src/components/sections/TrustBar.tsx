'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { TrustStat } from '@/types/content';

interface TrustBarProps {
  stats: TrustStat[];
}

export function TrustBar({ stats }: TrustBarProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="relative border-y border-white/[0.04] bg-white/[0.01] py-10 lg:py-14">
      <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center text-center gap-2"
            >
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal to-[#5aeacc] bg-clip-text text-transparent font-[family-name:var(--font-outfit)]">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs text-white/60 font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
