'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { mainNav } from '@/content/navigation';
import { isNavGroup } from '@/types/content';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route/pathname change
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMobileOpen(false);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    let lastScrollHeight = document.documentElement.scrollHeight;

    const updateHeight = () => {
      lastScrollHeight = document.documentElement.scrollHeight;
    };

    // Use ResizeObserver to dynamically track document height changes (like image loads)
    // without triggering layout reflows during scroll ticks.
    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      
      // Use cached scrollHeight to prevent layout thrashing.
      // Use a smaller threshold (30px) so the header hides only at the very bottom
      // and shows immediately when scrolling up.
      const isAtBottom = window.innerHeight + scrollY >= lastScrollHeight - 30;
      setIsHidden(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    updateHeight();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'
      } ${
        isScrolled
          ? 'py-2 bg-black/95 backdrop-blur-xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-[var(--max-w-wide)] mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative w-16 h-16 lg:w-20 lg:h-20 transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/images/logo/logo.png"
              alt="CodingBull Technovations"
              fill
              sizes="(max-width: 768px) 48px, 56px"
              className="object-contain"
              priority
              loading="eager"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-outfit)] tracking-tight text-white leading-none">
              Coding<span className="text-teal">Bull</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium hidden sm:block mt-1">
              Technovations Pvt. Ltd.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {mainNav.map((entry) =>
            isNavGroup(entry) ? (
              <div
                key={entry.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(entry.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={entry.href || '#'}
                  className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-1.5 cursor-pointer rounded-lg hover:bg-white/[0.04]"
                  aria-expanded={openDropdown === entry.label}
                  aria-haspopup="true"
                >
                  {entry.label}
                  <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === entry.label ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Link>

                <AnimatePresence>
                  {openDropdown === entry.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[110]"
                    >
                      <div className="p-2">
                        {entry.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group/item flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
                          >
                            <div className="mt-0.5 w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-teal/20 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white/90 group-hover/item:text-white">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-xs text-white/40 mt-0.5 leading-relaxed">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/[0.04]"
              >
                {entry.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <Button
            label="Initialize Project"
            href="/contact"
            variant="primary"
            trackingSource="header_cta"
            size="default"
          />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden relative z-[70] w-12 h-12 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          <div className="w-6 flex flex-col gap-[5px]">
            <span
              className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                isMobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 ${
                isMobileOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`w-full h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
                isMobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </div>
        </button>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-[110]"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Panel */}
          <motion.nav
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#060608]/90 backdrop-blur-3xl border-l border-white/[0.08] lg:hidden overflow-y-auto z-[120] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-teal/60 before:via-teal/20 before:to-transparent"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Scanline pattern layer */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px] z-0" />

            {/* Close Button inside Panel */}
            <div className="absolute top-5 right-6 z-[30]">
              <button
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 text-white hover:border-white/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] bg-white/5 backdrop-blur-md"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center relative">
                  <span className="w-4 h-[1.5px] bg-white rounded-full rotate-45 absolute" />
                  <span className="w-4 h-[1.5px] bg-white rounded-full -rotate-45 absolute" />
                </div>
              </button>
            </div>

            <div className="relative z-10 p-6 pt-24 flex flex-col justify-between min-h-full">
              {/* Top links */}
              <div className="flex flex-col gap-6">
                {mainNav.map((entry, idx) =>
                  isNavGroup(entry) ? (
                    <div key={entry.label} className="flex flex-col gap-2">
                      <span className="font-mono text-[9px] font-bold text-teal bg-teal/5 px-2.5 py-1 border border-teal/15 w-max tracking-[0.25em] uppercase">
                        {'[ SECTION 0'}{idx + 1}{' // '}{entry.label}{' ]'}
                      </span>
                      <div className="flex flex-col gap-2 mt-2 pl-2">
                        {entry.items.map((item, subIdx) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col gap-0.5 py-1.5 px-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300 border-l border-transparent hover:border-teal/40"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <div className="flex items-center gap-2 text-[15px] font-semibold font-[family-name:var(--font-outfit)] text-white/90 group-hover:text-teal transition-colors">
                              <span className="font-mono text-xs text-teal/50">
                                0{subIdx + 1}.
                              </span>
                              {item.label}
                            </div>
                            {item.description && (
                              <span className="text-[11px] text-white/40 font-light leading-normal pl-5">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div key={entry.label} className="flex flex-col gap-2">
                      {idx === 1 && (
                        <span className="font-mono text-[9px] font-bold text-teal bg-teal/5 px-2.5 py-1 border border-teal/15 w-max tracking-[0.25em] uppercase mb-3 block">
                          [ SECTION 02 // DIRECTORY ]
                        </span>
                      )}
                      <Link
                        href={entry.href}
                        className="group flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.04] text-[15px] font-semibold font-[family-name:var(--font-outfit)] text-white/90 hover:text-white transition-all duration-300 border-l border-transparent hover:border-teal/40 hover:pl-4"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span className="text-teal/50 group-hover:text-teal group-hover:translate-x-1 transition-all">
                          &gt;
                        </span>
                        {entry.label}
                      </Link>
                    </div>
                  )
                )}
              </div>

              {/* Bottom footer & CTA */}
              <div className="flex flex-col gap-6 pt-8 mt-8 border-t border-white/[0.06]">
                <Button
                  label="Get Fixed-Price Quote"
                  href="https://wa.me/917984891664?text=Hi%2C%20I'd%20like%20to%20discuss%20a%20custom%20software%20project%20with%20CodingBull."
                  variant="primary"
                  icon="whatsapp"
                  trackingSource="mobile_menu_cta"
                  className="w-full justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_35px_rgba(20,184,166,0.4)] transition-shadow duration-500 py-3.5 text-sm"
                  size="large"
                />

                {/* Tactical Status Footer */}
                <div className="flex flex-col gap-2 font-mono text-[10px] text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
                    </span>
                    <span className="text-white/60 tracking-wider">SYSTEM STATUS: ONLINE</span>
                  </div>
                  <div className="tracking-wide">
                    GSTIN: <span className="text-white/60">24AAMCC7617E1ZP</span>
                  </div>
                  <div className="text-[9px] tracking-wider text-white/30 uppercase mt-1">
                    {'AHMEDABAD, IN // NEW YORK, USA'}
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
