'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Testimonial } from '@/types/content';

const testimonials: Testimonial[] = [
  {
    quote:
      'CodingBull built our entire clinic management system from scratch. The scheduling, patient intake, and follow-up workflows actually match how our clinic operates — no forced workarounds.',
    name: 'Healthcare Client',
    role: 'Clinic Director',
    company: 'PhysioWays',
    industry: 'Healthcare',
  },
  {
    quote:
      'Working with a founder who understands business processes made all the difference. Our HRMS now handles payroll, attendance, and leave management without the issues we had with our previous solution.',
    name: 'Operations Client',
    role: 'Operations Head',
    company: 'Enterprise Client',
    industry: 'HRMS',
  },
  {
    quote:
      'Fixed pricing gave us complete budget clarity. The system was delivered on time and actually does what was scoped — including the admin dashboard and reporting we needed from day one.',
    name: 'E-commerce Client',
    role: 'Business Owner',
    company: 'E-commerce Platform',
    industry: 'E-commerce',
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-copper/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[var(--max-w-narrow)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper/60 block mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
            <span className="text-white">What Clients </span>
            <span className="bg-gradient-to-r from-copper to-[#d4a97a] bg-clip-text text-transparent">Say</span>
          </h2>
        </motion.div>

        <div className="relative min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-10 lg:p-14 text-center"
            >
              <div className="text-copper/20 text-6xl font-serif leading-none mb-5 select-none">&ldquo;</div>
              <p className="text-base sm:text-lg lg:text-xl text-white/50 leading-[1.8] mb-8 font-light italic">
                {testimonials[current].quote}
              </p>
              <div>
                <p className="text-sm font-semibold text-white/80 font-[family-name:var(--font-outfit)]">
                  {testimonials[current].name}
                </p>
                <p className="text-xs text-white/25 mt-1">
                  {testimonials[current].role} · {testimonials[current].industry}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === current
                  ? 'bg-copper/60 w-8'
                  : 'bg-white/10 w-1.5 hover:bg-white/20'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
