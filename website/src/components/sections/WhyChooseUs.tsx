'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { WhyChooseUsItem } from '@/types/content';

interface WhyChooseUsProps {
  items: WhyChooseUsItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  price: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  process: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  ),
  maintain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

export function WhyChooseUs({ items }: WhyChooseUsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-copper/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 border-y border-white/[0.03]" />

      <div className="relative max-w-[var(--max-w-content)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal/60 block mb-4">
            Why CodingBull
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-[1.1] mb-5">
            <span className="text-white">Why Businesses Choose </span>
            <span className="bg-gradient-to-r from-teal to-white bg-clip-text text-transparent">CodingBull</span>
          </h2>
          <p className="text-white/70 text-base lg:text-lg max-w-2xl leading-relaxed font-light">
            We deliver custom software through a model that eliminates risk, reduces cost uncertainty, and ensures every system fits your actual business operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.015] p-7 lg:p-8 transition-all duration-500 hover:bg-[#0a0c10] overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
            >
              {/* Premium Cursor-Tracking Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:duration-300 duration-500 pointer-events-none" 
                style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(20, 184, 166, 0.08), transparent 40%)' }} 
              />
              
              {/* Soft border tracker */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:duration-300 duration-500 pointer-events-none" 
                style={{ boxShadow: 'inset 0 0 0 1px rgba(20, 184, 166, 0.15)', maskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent 100%)', WebkitMaskImage: 'radial-gradient(300px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent 100%)' }} 
              />

              <div className="relative flex items-start gap-5 z-10">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-teal/[0.05] flex items-center justify-center text-teal/80 group-hover:bg-teal/[0.15] group-hover:text-teal group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-500">
                  {iconMap[item.icon] ?? iconMap.process}
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold font-[family-name:var(--font-outfit)] text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
