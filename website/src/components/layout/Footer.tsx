import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, MapPin } from 'lucide-react';
import { footerContent } from '@/content/footer';
import { enabledFooterSocialLinks, type SocialLink } from '@/lib/social-links';
import { getPublicSocialLinksConfig } from '@/lib/server/social-links';

function BrandIcon({ platform }: { platform: string }) {
  const iconClass = 'h-4 w-4';

  switch (platform) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M5.34 8.98H1.75V22h3.59V8.98ZM3.55 3A2.08 2.08 0 1 0 3.5 7.16 2.08 2.08 0 0 0 3.55 3ZM22.25 14.54c0-3.49-1.86-5.11-4.35-5.11a3.74 3.74 0 0 0-3.37 1.85h-.05v-2.3h-3.44V22h3.59v-6.44c0-1.7.32-3.35 2.43-3.35 2.08 0 2.11 1.94 2.11 3.46V22h3.58v-7.46Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M14.2 22v-8.35h2.8l.42-3.26H14.2V8.31c0-.94.26-1.59 1.62-1.59h1.73V3.81A23.1 23.1 0 0 0 15.03 3c-2.5 0-4.21 1.52-4.21 4.32v2.41H8v3.26h2.82V22h3.38Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.86 12 9.6 15.57Z" />
        </svg>
      );
    case 'googleBusiness':
      return <MapPin className={iconClass} aria-hidden="true" />;
    default:
      return <ExternalLink className={iconClass} aria-hidden="true" />;
  }
}

function SocialLinkItem({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/50 hover:bg-teal/10 hover:text-teal hover:shadow-[0_0_24px_rgba(167,220,244,0.18)]"
      aria-label={`Open CodingBull on ${link.label}`}
      title={link.label}
    >
      <BrandIcon platform={link.platform} />
    </a>
  );
}

function InstagramContentEmbed({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  return (
    <div className="mb-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="grid gap-0 lg:grid-cols-[0.7fr_1fr]">
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal">
            Social Proof
          </p>
          <h3 className="mt-4 text-2xl font-light leading-tight text-white">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
            Live Instagram content is loaded only when an official Instagram embed URL is configured in admin.
          </p>
        </div>
        <div className="min-h-[420px] bg-black/30">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            className="h-[520px] w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
}

export async function Footer() {
  const socialConfig = await getPublicSocialLinksConfig();
  const footerSocialLinks = enabledFooterSocialLinks(socialConfig);
  const instagramContent = socialConfig.instagramContent;
  const shouldShowInstagramEmbed = instagramContent.enabled && instagramContent.embedUrl;

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

        {shouldShowInstagramEmbed && (
          <InstagramContentEmbed
            embedUrl={instagramContent.embedUrl}
            title={instagramContent.title}
          />
        )}

        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {footerSocialLinks.length > 0 ? (
            <div className="flex items-center gap-3">
              {footerSocialLinks.map((link) => (
                <SocialLinkItem key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <div className="hidden md:block" aria-hidden="true" />
          )}

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
