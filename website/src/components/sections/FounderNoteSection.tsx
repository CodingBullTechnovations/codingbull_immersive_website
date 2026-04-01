'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { FounderNote } from '@/types/content';

interface FounderNoteSectionProps {
  content: FounderNote;
}

export function FounderNoteSection({ content }: FounderNoteSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-copper/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[var(--max-w-wide)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative w-full lg:w-2/5 min-h-[400px] lg:min-h-[500px]">
              <Image
                src="/images/about/cbt-founder.jpeg"
                alt={content.name}
                fill
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,20,0.8)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[rgba(10,12,20,0.95)]" />
            </div>

            {/* Note Section */}
            <div className="w-full lg:w-3/5 p-10 lg:p-16 relative flex flex-col justify-center">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-copper/[0.06] to-transparent pointer-events-none" />

              <div className="relative">
                <div className="text-copper/15 text-7xl font-serif leading-none mb-6 select-none">&ldquo;</div>

                <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-[1.8] mb-10 font-light italic">
                  {content.message}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-8 border-t border-white/[0.04]">
                  <div>
                    <p className="text-lg font-semibold font-[family-name:var(--font-outfit)] text-white">
                      {content.name}
                    </p>
                    <p className="text-sm text-copper/60 mt-0.5 uppercase tracking-widest">{content.role}</p>
                  </div>

                  <Button
                    label={content.cta.label}
                    href={content.cta.href}
                    variant={content.cta.variant}
                    icon={content.cta.icon}
                    trackingSource={content.cta.trackingSource}
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
