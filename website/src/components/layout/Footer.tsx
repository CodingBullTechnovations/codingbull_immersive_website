import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin } from 'lucide-react';
import { footerContent } from '@/content/footer';
import { siteConfig } from '@/content/site';
import { enabledFooterSocialLinks, enabledSocialContentEmbeds, type SocialContentEmbed, type SocialLink } from '@/lib/social-links';
import { getPublicSocialLinksConfig } from '@/lib/server/social-links';

function BrandIcon({ platform }: { platform: string }) {
  const iconClass = 'h-4 w-4';
  if (platform === 'instagram') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg>;
  if (platform === 'linkedin') return <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true"><path d="M5.34 8.98H1.75V22h3.59V8.98ZM3.55 3A2.08 2.08 0 1 0 3.5 7.16 2.08 2.08 0 0 0 3.55 3ZM22.25 14.54c0-3.49-1.86-5.11-4.35-5.11a3.74 3.74 0 0 0-3.37 1.85h-.05v-2.3h-3.44V22h3.59v-6.44c0-1.7.32-3.35 2.43-3.35 2.08 0 2.11 1.94 2.11 3.46V22h3.58v-7.46Z" /></svg>;
  if (platform === 'facebook') return <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true"><path d="M14.2 22v-8.35h2.8l.42-3.26H14.2V8.31c0-.94.26-1.59 1.62-1.59h1.73V3.81A23.1 23.1 0 0 0 15.03 3c-2.5 0-4.21 1.52-4.21 4.32v2.41H8v3.26h2.82V22h3.38Z" /></svg>;
  if (platform === 'youtube') return <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.86 12 9.6 15.57Z" /></svg>;
  if (platform === 'googleBusiness') return <MapPin className={iconClass} aria-hidden="true" />;
  return <ExternalLink className={iconClass} aria-hidden="true" />;
}

function SocialLinkItem({ link }: { link: SocialLink }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center border border-white/12 text-white/55 transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--accent-bright)]" aria-label={`Open CodingBull on ${link.label}`} title={link.label}>
      <BrandIcon platform={link.platform} />
    </a>
  );
}

function SocialContentBlock({ embeds }: { embeds: SocialContentEmbed[] }) {
  if (embeds.length === 0) return null;
  return (
    <section className="mb-16 border border-white/10" aria-labelledby="social-proof-title">
      <div className="grid lg:grid-cols-[0.7fr_1fr]">
        <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r lg:p-10">
          <p className="cb-kicker">Social proof</p>
          <h3 id="social-proof-title" className="mt-6 max-w-[13ch] font-[family-name:var(--font-display)] text-3xl font-medium leading-tight tracking-[-0.04em] text-white">Updates from active CodingBull channels.</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/68">Only approved embed URLs configured through the admin settings are rendered here.</p>
        </div>
        <div className={`grid gap-px bg-white/10 ${embeds.length > 1 ? 'xl:grid-cols-2' : ''}`}>
          {embeds.map((embed) => (
            <article key={embed.id} className="bg-[var(--surface-card)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                {/* Crawlable outbound link — the iframe content itself gives
                    search engines nothing; this anchor carries the signal. */}
                <a
                  href={embed.embedUrl.replace(/\/?embed\/?(\?.*)?$/, '')}
                  target="_blank"
                  rel="noopener"
                  className="text-xs font-semibold text-white transition-colors hover:text-[var(--accent-bright)]"
                >
                  {embed.title} <span aria-hidden="true">↗</span>
                </a>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-soft)]">{embed.platform}</span>
              </div>
              {/* Instagram embeds are white-only; frame them as a deliberate
                  card instead of a full-width slab. */}
              <div className="flex justify-center p-4 sm:p-5">
                <iframe
                  src={embed.embedUrl}
                  title={embed.title}
                  loading="lazy"
                  className="h-[500px] w-full max-w-[540px] border border-white/10 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Footer() {
  const socialConfig = await getPublicSocialLinksConfig();
  const footerSocialLinks = enabledFooterSocialLinks(socialConfig);
  const socialContentEmbeds = enabledSocialContentEmbeds(socialConfig);

  return (
    <footer className="mind-footer relative overflow-hidden border-t border-white/10 px-5 pb-6 pt-20 sm:px-8 lg:px-10 lg:pt-28" role="contentinfo">
      <div className="public-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-[var(--max-w-wide)]">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-14"><Image src="/images/logo/logo.png" alt="CodingBull Technovations bull emblem" fill sizes="56px" className="object-contain" /></div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.035em] text-white">Coding<span className="text-[var(--accent)]">Bull</span></p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-white/58">Technovations Pvt. Ltd.</p>
              </div>
            </div>
            <h2 className="mt-10 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.8vw,5rem)] font-medium leading-[0.94] tracking-[-0.058em] text-white">Software should fit the operation.</h2>
            <div className="mt-9 grid gap-2 text-sm text-white/68 sm:grid-cols-2">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a>
              <a href={`tel:${siteConfig.phone.replaceAll(' ', '')}`} className="hover:text-white">{siteConfig.phone}</a>
              <span>Ahmedabad, Gujarat, India</span>
              <span>GSTIN 24AAMCC7617E1ZP</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            {footerContent.columns.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">{column.title}</h3>
                <ul className="mt-6 space-y-4">
                  {column.links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm leading-6 text-white/68 transition-colors hover:text-white">{link.label}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <SocialContentBlock embeds={socialContentEmbeds} />

        <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
          {footerSocialLinks.length > 0 ? <div className="flex items-center gap-2">{footerSocialLinks.map((link) => <SocialLinkItem key={link.id} link={link} />)}</div> : <span className="hidden md:block" aria-hidden="true" />}
          <p className="max-w-2xl text-xs leading-5 text-white/58">{footerContent.companyInfo}</p>
          <div className="flex gap-5">{footerContent.legalLinks.map((link) => <Link key={link.href} href={link.href} className="font-mono text-xs uppercase tracking-[0.14em] text-white/62 hover:text-white">{link.label}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}
