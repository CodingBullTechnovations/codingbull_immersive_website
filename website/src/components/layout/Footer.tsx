import Link from 'next/link';
import Image from 'next/image';
import { footerContent } from '@/content/footer';

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/[0.05] overflow-hidden pt-24 lg:pt-32" role="contentinfo">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[var(--max-w-wide)] mx-auto px-6 lg:px-10">
        
        {/* Top Section: Brand & Links Grid */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-24">
          
          {/* Left: Identity & Big Logo */}
          <div className="max-w-md flex flex-col items-start">
            {/* Massive Glowing Logo */}
            <div className="relative w-36 h-36 lg:w-48 lg:h-48 mb-6 group cursor-default">
              <div className="absolute inset-0 bg-teal/20 blur-3xl rounded-full transition-colors duration-700 pointer-events-none" />
              <Image
                src="/images/logo/logo.png"
                alt="CodingBull"
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-contain opacity-90 drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                quality={60}
              />
            </div>
            
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal block mb-6">
              CodingBull Technovations Pvt. Ltd.
            </span>
            <p className="text-2xl sm:text-3xl font-light font-[family-name:var(--font-outfit)] text-white/90 leading-[1.3] mb-8">
              Enterprise software architecture and proprietary Business Process Automation designed for scale.
            </p>

            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
                GSTIN: <span className="text-white font-bold tracking-widest">24AAMCC7617E1ZP</span>
              </span>
            </div>
          </div>

          {/* Right: Links Matrix */}
          <div className="flex flex-wrap sm:flex-nowrap gap-12 sm:gap-16 lg:gap-24">
            {footerContent.columns.map((column) => (
              <div key={column.title} className="min-w-[120px]">
                <h3 className="text-[10px] font-semibold text-white/60 mb-6 font-[family-name:var(--font-outfit)] uppercase tracking-[0.2em]">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-teal transition-colors duration-300 relative group inline-flex"
                      >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Socials & Legal Bar - Removed social links until verified */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
          </div>

          <p className="text-[11px] text-white/60 font-medium tracking-wider uppercase">
            {footerContent.companyInfo}
          </p>

          <div className="flex gap-6">
            {footerContent.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] text-white/60 hover:text-white transition-colors tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Edge-to-Edge Typography */}
      <div className="w-full overflow-hidden flex justify-center items-end mt-10 opacity-40 mix-blend-screen pointer-events-none select-none">
        <h2 className="text-[16vw] font-black font-[family-name:var(--font-outfit)] leading-[0.75] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-black">
          CODINGBULL
        </h2>
      </div>

    </footer>
  );
}
