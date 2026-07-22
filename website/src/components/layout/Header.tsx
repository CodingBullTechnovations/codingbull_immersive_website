'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { mainNav } from '@/content/navigation';
import { isNavGroup } from '@/types/content';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMobileOpen(false);
      setOpenDropdown(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = mobilePanelRef.current?.querySelector<HTMLElement>('a[href], button');
    firstLink?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [isMobileOpen]);

  const handleMobileKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setIsMobileOpen(false);
      return;
    }
    if (event.key !== 'Tab' || !mobilePanelRef.current) return;
    const focusable = Array.from(
      mobilePanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${isScrolled ? 'border-b border-white/[0.08] bg-[#05070a]/92 backdrop-blur-xl' : 'bg-gradient-to-b from-[#05070a]/85 to-transparent'}`}>
        <div className="mx-auto flex h-20 max-w-[100rem] items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-14">
          <Link href="/" className="group flex items-center gap-3" aria-label="CodingBull Technovations home">
            <span className="relative h-11 w-9 shrink-0">
              <Image
                src="/images/logo/logo.png"
                alt=""
                fill
                sizes="36px"
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </span>
            <span className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-none tracking-[-0.035em] text-white">
                Coding<span className="text-[var(--accent)]">Bull</span>
              </span>
              <span className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">
                Technovations Pvt. Ltd.
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {mainNav.map((entry) => {
              if (!isNavGroup(entry)) {
                const active = pathname === entry.href || pathname?.startsWith(`${entry.href}/`);
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    aria-current={active ? 'page' : undefined}
                    className={`px-3 py-2 text-xs font-medium tracking-[0.04em] transition-colors ${active ? 'text-white' : 'text-white/52 hover:text-white'}`}
                  >
                    {entry.label}
                  </Link>
                );
              }

              const dropdownId = `nav-${entry.label.toLowerCase().replaceAll(' ', '-')}`;
              const active = entry.items.some((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));
              return (
                <div
                  key={entry.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(entry.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onFocus={() => setOpenDropdown(entry.label)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setOpenDropdown(null);
                  }}
                >
                  <Link
                    href={entry.href || entry.items[0].href}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium tracking-[0.04em] transition-colors ${active ? 'text-white' : 'text-white/52 hover:text-white'}`}
                    aria-expanded={openDropdown === entry.label}
                    aria-controls={dropdownId}
                    aria-haspopup="true"
                  >
                    {entry.label}
                    <span aria-hidden="true" className={`text-xs transition-transform ${openDropdown === entry.label ? 'rotate-45' : ''}`}>＋</span>
                  </Link>

                  <AnimatePresence>
                    {openDropdown === entry.label && (
                      <motion.div
                        id={dropdownId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-full w-[23rem] -translate-x-1/2 pt-4"
                      >
                        <div className="border border-white/10 bg-[var(--surface-panel)]/98 p-2 shadow-[0_28px_80px_-25px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                          <div className="mb-1 flex items-center justify-between border-b border-white/[0.07] px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white/28">
                            <span>{entry.label} directory</span>
                            <span>0{entry.items.length}</span>
                          </div>
                          {entry.items.map((item, index) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="group/item grid grid-cols-[2rem_1fr] gap-3 border-b border-white/[0.05] px-3 py-3 last:border-b-0 hover:bg-white/[0.035]"
                            >
                              <span className="pt-0.5 font-mono text-xs text-[var(--accent-soft)]">0{index + 1}</span>
                              <span>
                                <span className="block text-xs font-medium text-white/82 group-hover/item:text-white">{item.label}</span>
                                {item.description && <span className="mt-1 block text-xs leading-4 text-white/35">{item.description}</span>}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button label="Start a project" href="/contact" variant="primary" icon="arrow" trackingSource="header_cta" />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.025] lg:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            <span className="relative h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-1 h-px w-5 bg-white transition-transform ${isMobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`absolute bottom-1 left-0 h-px w-5 bg-white transition-transform ${isMobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            id="mobile-navigation"
            ref={mobilePanelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-[#05070a] px-5 pb-10 pt-28 sm:px-8 lg:hidden"
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
            onKeyDown={handleMobileKeyDown}
          >
            <div className="public-grid pointer-events-none absolute inset-0 opacity-35" />
            <div className="relative mx-auto max-w-2xl">
              <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs uppercase tracking-[0.22em] text-white/35">
                <span>Navigation index</span>
                <span>CodingBull / 2026</span>
              </div>

              <div className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
                {mainNav.map((entry, index) => (
                  <div key={entry.label} className="py-5">
                    {isNavGroup(entry) ? (
                      <>
                        <Link href={entry.href || entry.items[0].href} className="mb-4 flex items-baseline gap-4 text-2xl font-medium tracking-[-0.035em] text-white">
                          <span className="font-mono text-xs tracking-normal text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
                          {entry.label}
                        </Link>
                        <div className="grid gap-2 pl-8 sm:grid-cols-2">
                          {entry.items.map((item) => (
                            <Link key={item.href} href={item.href} className="text-sm leading-6 text-white/48 transition-colors hover:text-white">
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link href={entry.href} className="flex items-baseline gap-4 text-2xl font-medium tracking-[-0.035em] text-white">
                        <span className="font-mono text-xs tracking-normal text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
                        {entry.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button label="Start a project" href="/contact" variant="primary" icon="arrow" trackingSource="mobile_header_cta" size="large" className="w-full" />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
