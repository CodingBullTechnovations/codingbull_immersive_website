'use client';

import { useEffect, useState } from 'react';
import type { InsightSidebarWidgetConfig } from '@/lib/sidebar-config';
import { siteConfig } from '@/content/site';

interface InsightSidebarProps {
  headings: { text: string; id: string }[];
  author: string;
  date: string;
  readingTime: string;
  slug: string;
  title: string;
  config: InsightSidebarWidgetConfig;
}

export function InsightSidebar({ headings, slug, title, config, author, date, readingTime }: InsightSidebarProps) {
  // Static, factual article metadata only — no simulated telemetry, fake
  // timestamps, or invented system activity.
  const articleFacts = [
    { label: 'AUTHOR', value: author.toUpperCase() },
    { label: 'PUBLISHED', value: date },
    { label: 'READ TIME', value: readingTime.toUpperCase() },
    { label: 'RENDER', value: 'SSR + ISR 60s' },
  ];
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }

      const headingElements = headings.map((h) => document.getElementById(h.id));
      let currentActiveId = '';

      for (const el of headingElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActiveId = el.id;
          }
        }
      }
      setActiveId(currentActiveId || (headings[0]?.id || ''));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const shareUrl = encodeURIComponent(`${siteConfig.baseUrl}/insights/${slug}`);
  const shareText = encodeURIComponent(title);
  const showShareButtons = config.shareLinks.linkedin || config.shareLinks.twitter || config.shareLinks.whatsapp;

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-28 flex flex-col gap-8">
        
        {/* Reading Progress Card */}
        <div className="relative p-6 border border-white/[0.04] bg-white/[0.01] overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-teal hover:border-teal/20 transition-all duration-300">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-3 font-mono">
            {'// READING PROGRESS'}
          </h4>
          <div className="flex items-center gap-4">
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-teal transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs text-teal font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="flex flex-col gap-4 p-6 border border-white/[0.03] bg-white/[0.005] hover:border-teal/20 transition-all duration-300">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 font-mono">
              {'// TABLE OF CONTENTS'}
            </h4>
            <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`transition-all duration-300 hover:text-teal block leading-normal border-l pl-3 ${
                    activeId === heading.id 
                      ? 'text-teal border-teal font-bold' 
                      : 'text-white/45 border-white/10'
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {config.hudTelemetry.enabled && (
          <div className="p-6 border border-teal/10 bg-teal/[0.01] font-mono text-xs text-white/50 relative overflow-hidden hover:border-teal/30 transition-all duration-300">
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px]" />
            
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-teal/80">
                {config.hudTelemetry.title}
              </h4>
              <svg className="w-8 h-4 text-teal opacity-80" viewBox="0 0 40 20" fill="none">
                <path 
                  d="M0 10 H12 L15 3 L18 17 L21 7 L23 11 L25 10 H40" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="animate-[dash_2s_linear_infinite]"
                  style={{
                    strokeDasharray: '80',
                    strokeDashoffset: '80'
                  }}
                />
              </svg>
              <style jsx global>{`
                @keyframes dash {
                  to {
                    strokeDashoffset: -80;
                  }
                }
              `}</style>
            </div>
            
            <div className="space-y-3">
              {config.hudTelemetry.showSystemState && (
                <div className="flex items-center justify-between">
                  <span>ARTICLE STATUS:</span>
                  <div className="flex items-center gap-1.5 text-teal">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal"></span>
                    </span>
                    <span className="font-bold text-xs">PUBLISHED</span>
                  </div>
                </div>
              )}

              {config.hudTelemetry.showLatency && (
                <div className="flex items-center justify-between">
                  <span>READ TIME:</span>
                  <span className="text-white/80 font-bold text-xs">{readingTime.toUpperCase()}</span>
                </div>
              )}

              {config.hudTelemetry.showIsrCache && (
                <div className="flex items-center justify-between">
                  <span>PAGE ISR CACHE:</span>
                  <span className="text-white/80 font-bold text-xs">60s WINDOW</span>
                </div>
              )}

              {config.hudTelemetry.showClock && (
                <div className="flex items-center justify-between">
                  <span>PUBLISHED:</span>
                  <span className="text-white/80 font-semibold text-xs">{date}</span>
                </div>
              )}

              {config.hudTelemetry.showConsoleFeed && (
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <span className="text-xs uppercase tracking-wider text-white/60 block mb-1.5">{'// ARTICLE FACTS:'}</span>
                  <div className="bg-black/40 p-2.5 border border-white/[0.03] space-y-1.5">
                    {articleFacts.map((fact) => (
                      <div key={fact.label} className="text-xs leading-tight truncate text-teal/70 font-mono">
                        <span className="text-white/20 select-none">&gt;</span> {fact.label} → {fact.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {config.hudTelemetry.showActivityBars && (
                <div className="mt-2 flex items-end justify-between h-8 gap-0.5 opacity-60" aria-hidden="true">
                  {/* Real read progress, quantized into eight bars. */}
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
                      className={`w-full transition-colors duration-300 ${progress >= ((index + 1) / 8) * 100 ? 'bg-teal/50' : 'bg-teal/15'}`}
                      style={{ height: `${8 + index * 2.5}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {config.architectureSpecs.enabled && config.architectureSpecs.categories.length > 0 && (
          <div className="p-6 border border-white/[0.04] bg-white/[0.01] hover:border-teal/20 transition-all duration-300">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-4 font-mono">
              {config.architectureSpecs.title}
            </h4>
            <div className="space-y-4">
              {config.architectureSpecs.categories.map((category) => (
                <div key={category.label}>
                  <span className="text-xs uppercase text-white/60 font-mono block mb-1.5">{category.label}</span>
                  <div className="flex flex-wrap gap-1.5 font-mono font-semibold uppercase tracking-wider text-xs">
                    {category.tags.map((tag) => (
                      <span
                        key={`${category.label}-${tag.text}`}
                        className={`px-2.5 py-1 rounded border ${tag.accent ? 'bg-teal/10 border-teal/20 text-teal' : 'bg-white/5 border-white/10 text-white/70'}`}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {config.shareLinks.enabled && showShareButtons && (
          <div className="flex flex-col gap-4 p-6 border border-white/[0.03] bg-white/[0.005] hover:border-teal/20 transition-all duration-300">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 font-mono">
              {'// SHARE INSIGHT'}
            </h4>
            <div className="flex items-center gap-3">
              {config.shareLinks.linkedin && (
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {config.shareLinks.twitter && (
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
                  aria-label="Share on X"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {config.shareLinks.whatsapp && (
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
                  aria-label="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
