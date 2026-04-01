'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'alternate' | 'hero';
  maxWidth?: 'narrow' | 'content' | 'wide';
  padding?: 'normal' | 'large';
}

const bgClasses: Record<string, string> = {
  default: '',
  alternate: 'gradient-bg-section',
  hero: 'gradient-bg-hero',
};

const maxWidthClasses: Record<string, string> = {
  narrow: 'max-w-[var(--max-w-narrow)]',
  content: 'max-w-[var(--max-w-content)]',
  wide: 'max-w-[var(--max-w-wide)]',
};

export function SectionWrapper({
  children,
  className = '',
  id,
  background = 'default',
  maxWidth = 'content',
  padding = 'normal',
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const paddingClass = padding === 'large'
    ? 'py-[var(--spacing-4xl)] px-[var(--spacing-lg)]'
    : 'py-[var(--spacing-3xl)] px-[var(--spacing-lg)]';

  return (
    <section
      ref={ref}
      id={id}
      className={`${bgClasses[background]} ${paddingClass} ${className}`}
    >
      <motion.div
        className={`${maxWidthClasses[maxWidth]} w-full mx-auto`}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  );
}
