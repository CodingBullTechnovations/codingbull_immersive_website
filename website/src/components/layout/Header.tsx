'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { mainNav } from '@/content/navigation';
import { isNavGroup } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Hide header when reaching the footer to prevent visual collision
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsHidden(isAtBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
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

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-5">
          <ThemeToggle />
          <Button
            label="Get Quote"
            href="#whatsapp"
            variant="primary"
            icon="whatsapp"
            trackingSource="header_cta"
            size="default"
          />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden relative w-10 h-10 flex items-center justify-center cursor-pointer"
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Panel */}
            <motion.nav
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-black/98 backdrop-blur-2xl border-l border-white/[0.06] lg:hidden overflow-y-auto z-[60]"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="p-6 pt-20 flex flex-col gap-1">
                {mainNav.map((entry) =>
                  isNavGroup(entry) ? (
                    <div key={entry.label} className="mb-4">
                      <span className="text-[10px] font-semibold text-teal/60 uppercase tracking-[0.2em] px-3 mb-2 block">
                        {entry.label}
                      </span>
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-3 text-[15px] text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200 border-l-2 border-transparent hover:border-teal/40 ml-2"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className="block px-3 py-3.5 text-[15px] text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {entry.label}
                    </Link>
                  )
                )}
                <div className="pt-6 mt-4 border-t border-white/[0.06]">
                  <Button
                    label="Get Fixed-Price Quote"
                    href="#whatsapp"
                    variant="primary"
                    icon="whatsapp"
                    trackingSource="mobile_menu_cta"
                    className="w-full justify-center"
                    size="large"
                  />
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
