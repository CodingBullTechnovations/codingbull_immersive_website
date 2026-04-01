'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const featuredStudies = [
  {
    slug: 'physioway',
    title: 'PhysioWays',
    industry: 'Healthcare',
    summary: 'Proprietary clinic management platform with appointment booking, patient tracking, and care coordination.',
    outcome: 'Currently powering Physioway Active Health LLP',
    gradient: 'from-teal/10 to-teal/[0.02]',
    borderHover: 'hover:border-teal/15',
  },
  {
    slug: 'shashwat-ivf',
    title: 'Shashwat IVF',
    industry: 'Healthcare',
    summary: 'Proprietary patient management and scheduling system engineered for complex IVF treatment workflows.',
    outcome: 'Currently powering Shashwat IVF',
    gradient: 'from-copper/10 to-copper/[0.02]',
    borderHover: 'hover:border-copper/15',
  },
  {
    slug: 'anr-mechanical',
    title: 'ANR Mechanical',
    industry: 'Operations',
    summary: 'Proprietary Business Process Automation and enterprise reporting engine for massive operational supply chains.',
    outcome: 'Deployed at ANR Mechanical (Tesla Supply Chain, NY)',
    gradient: 'from-[#6366f1]/10 to-[#6366f1]/[0.02]',
    borderHover: 'hover:border-[#6366f1]/15',
  },
];

interface FeaturedCaseStudiesProps {
  slugs: string[];
}

export function FeaturedCaseStudies({ slugs }: FeaturedCaseStudiesProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const studies = featuredStudies.filter((s) => slugs.includes(s.slug));

  return (
    <section ref={ref} className="relative py-28 lg:py-36 px-6 lg:px-10 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-teal/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[var(--max-w-content)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal/60 block mb-4">
            Proprietary Architecture
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] tracking-tight leading-[1.1] mb-5">
                <span className="text-white">Platforms We </span>
                <span className="bg-gradient-to-r from-teal to-[#5aeacc] bg-clip-text text-transparent">Deploy</span>
              </h2>
              <p className="text-white/70 text-base lg:text-lg max-w-xl leading-relaxed font-light">
                Enterprise-grade Business Process Automation currently powering industry leaders.
              </p>
            </div>
            <Button
              label="View All Deployments"
              href="/case-studies"
              variant="secondary"
              icon="arrow"
              trackingSource="home_case_studies_cta"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {studies.map((study, index) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 * index,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className={`group relative block h-full rounded-2xl border border-white/[0.04] bg-white/[0.015] overflow-hidden transition-all duration-500 ${study.borderHover} hover:shadow-[0_0_50px_rgba(45,212,191,0.06)]`}
              >
                {/* Visual area with gradient */}
                <div className={`relative h-52 bg-gradient-to-br ${study.gradient} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.03),transparent)]" />
                  <span className="text-4xl font-black font-[family-name:var(--font-outfit)] text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500 tracking-tight">
                    {study.title}
                  </span>
                </div>

                <div className="p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-white/[0.04] text-teal/80 uppercase tracking-wider">
                      {study.industry}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-outfit)] text-white mb-3 group-hover:text-teal transition-colors duration-300">
                    {study.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-4 font-light">
                    {study.summary}
                  </p>
                  <p className="text-xs text-copper/70 font-medium flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {study.outcome}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
