import type { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'alternate' | 'hero';
  maxWidth?: 'narrow' | 'content' | 'wide';
  padding?: 'normal' | 'large';
}

const bgClasses = {
  default: 'bg-[#05070a]',
  alternate: 'bg-[var(--surface-panel)]',
  hero: 'gradient-bg-hero',
};

const maxWidthClasses = {
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
  return (
    <section
      id={id}
      className={`${bgClasses[background]} ${padding === 'large' ? 'py-28 lg:py-40' : 'py-20 lg:py-28'} px-5 sm:px-8 lg:px-10 ${className}`}
    >
      <div className={`${maxWidthClasses[maxWidth]} mx-auto w-full`}>
        {children}
      </div>
    </section>
  );
}
