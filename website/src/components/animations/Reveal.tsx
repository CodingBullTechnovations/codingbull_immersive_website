'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type RevealTag = 'div' | 'section' | 'span' | 'header' | 'footer' | 'li' | 'article' | 'figure';

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  /** Seconds. Applied via --reveal-delay so staggering stays in CSS. */
  delay?: number;
  /**
   * 'self' animates this element; 'group' leaves the element static and
   * reveals every [data-reveal] descendant when it enters the viewport.
   */
  mode?: 'self' | 'group';
  /** Custom variant forwarded to data-reveal (e.g. 'line' for clip reveals). */
  variant?: string;
}

/**
 * The single scroll-reveal primitive for the public site. All hidden states
 * live in globals.css behind `@media (scripting: enabled)` so crawlers and
 * no-JS visitors always receive visible content.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay,
  mode = 'self',
  variant = '',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Hidden documents (background tabs, prerender, automation) suspend
    // IntersectionObserver callbacks — reveal immediately so content is never
    // stuck invisible; the choreography has no value in a hidden tab anyway.
    if (document.visibilityState === 'hidden') {
      element.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-revealed');
          observer.disconnect();
        }
      },
      // Near-zero threshold: tall group wrappers (longer than the viewport)
      // can never reach a fractional visibility ratio, so reveal as soon as
      // the element meaningfully enters the viewport instead.
      { threshold: 0.01, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = delay !== undefined ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={style}
      {...(mode === 'self' ? { 'data-reveal': variant } : {})}
    >
      {children}
    </Tag>
  );
}
