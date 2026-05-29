'use client';

import { useEffect, useState } from 'react';

interface InsightSidebarProps {
  headings: { text: string; id: string }[];
  author: string;
  date: string;
  readingTime: string;
  slug: string;
  title: string;
}

const LOG_TEMPLATES = [
  'SYS.INIT -> BOOT_SUCCESS',
  'DB.QUERY -> SELECT * FROM "Post"',
  'DB.CONN -> POOL_ACTIVE [12ms]',
  'ISR.SWG -> GENERATING_STATIC_PATH',
  'CDN.EDGE -> CACHE_HIT [LHR]',
  'SEO.JSONLD -> BUILT_SUCCESSFULLY',
  'UI.HYDRATE -> ENGINE_ACTIVE',
  'TELEMETRY -> TRANSCEIVER_OK',
  'SYS.LOG -> BUFFER_ROTATION_OK',
];

export function InsightSidebar({ headings, author, date, readingTime, slug, title }: InsightSidebarProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [systemTime, setSystemTime] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    '[00:00] SYS.INIT -> BOOT_SUCCESS',
    '[00:01] DB.CONN -> POOL_ACTIVE [12ms]',
    '[00:02] UI.HYDRATE -> ENGINE_ACTIVE'
  ]);

  useEffect(() => {
    // Keep a mock system clock updated to give that high-tech cockpit feeling
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cyber logs rotation
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().slice(14, 19);
      const randomLog = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      setLogs((prev) => [...prev.slice(1), `[${timeStr}] ${randomLog}`]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const shareUrl = encodeURIComponent(`https://codingbull.com/insights/${slug}`);
  const shareText = encodeURIComponent(title);

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-28 flex flex-col gap-8">
        
        {/* Reading Progress Card */}
        <div className="relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-xl overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-teal shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:border-teal/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] transition-all duration-300">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-3 font-mono">
            // READING PROGRESS
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
          <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.03] bg-white/[0.005] hover:border-teal/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] transition-all duration-300">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-mono">
              // TABLE OF CONTENTS
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

        {/* HUD System Telemetry Widget (Pro UI-UX addition) */}
        <div className="p-6 rounded-2xl border border-teal/10 bg-teal/[0.01] backdrop-blur-xl font-mono text-xs text-white/50 relative overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.02)] hover:border-teal/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] transition-all duration-300">
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px]" />
          
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-teal/80">
              [ HUD TELEMETRY MODULE ]
            </h4>
            {/* Pulsing Status Heartbeat SVG */}
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
            <div className="flex items-center justify-between">
              <span>SYSTEM STATE:</span>
              <div className="flex items-center gap-1.5 text-teal">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal"></span>
                </span>
                <span className="font-bold text-xs">ONLINE</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>LATENCY STATE:</span>
              <span className="text-white/80 font-bold text-xs">18ms (STABLE)</span>
            </div>

            <div className="flex items-center justify-between">
              <span>PAGE ISR CACHE:</span>
              <span className="text-white/80 font-bold text-xs">60s WINDOW</span>
            </div>

            <div className="flex items-center justify-between">
              <span>CLOCK_TIME:</span>
              <span className="text-white/80 font-semibold text-xs">{systemTime || 'LOADING...'}</span>
            </div>

            {/* Rolling Live Logs display */}
            <div className="mt-4 pt-3 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5">// LIVE CONSOLE FEED:</span>
              <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.03] space-y-1.5 h-[84px] overflow-hidden flex flex-col justify-end">
                {logs.map((log, i) => (
                  <div key={i} className="text-[10px] leading-tight truncate text-teal/70 font-mono">
                    <span className="text-white/20 select-none">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Micro grid activity visualization */}
            <div className="mt-2 flex items-end justify-between h-8 gap-0.5 opacity-60">
              <div className="w-full bg-teal/15 h-3 animate-pulse" />
              <div className="w-full bg-teal/30 h-5" />
              <div className="w-full bg-teal/20 h-4" />
              <div className="w-full bg-teal/40 h-6 [animation-delay:0.2s]" />
              <div className="w-full bg-teal/25 h-3" />
              <div className="w-full bg-teal/50 h-7 [animation-delay:0.4s]" />
              <div className="w-full bg-teal/35 h-5" />
              <div className="w-full bg-teal/15 h-2" />
            </div>
          </div>
        </div>

        {/* Architecture Spec Sheet Card */}
        <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-xl hover:border-teal/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] transition-all duration-300">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4 font-mono">
            // ARCHITECTURE SPECS
          </h4>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase text-white/40 font-mono block mb-1.5">Frameworks & SSR</span>
              <div className="flex flex-wrap gap-1.5 font-mono font-semibold uppercase tracking-wider text-[10px]">
                <span className="px-2.5 py-1 bg-teal/10 border border-teal/20 rounded text-teal">Next.js 16</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/70">React 19</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-white/40 font-mono block mb-1.5">State & Database</span>
              <div className="flex flex-wrap gap-1.5 font-mono font-semibold uppercase tracking-wider text-[10px]">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/70">Prisma Client</span>
                <span className="px-2.5 py-1 bg-teal/10 border border-teal/20 rounded text-teal">PostgreSQL</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-white/40 font-mono block mb-1.5">CDN & Optimizations</span>
              <div className="flex flex-wrap gap-1.5 font-mono font-semibold uppercase tracking-wider text-[10px]">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/70">ISR Caching</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white/70">Cloudflare</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sharing */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.03] bg-white/[0.005] hover:border-teal/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] transition-all duration-300">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-mono">
            // SHARE INSIGHT
          </h4>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
              aria-label="Share on X"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/40 hover:bg-teal/5 transition-all duration-300 cursor-pointer"
              aria-label="Share on WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </aside>
  );
}
