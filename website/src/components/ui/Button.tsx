'use client';

import Link from 'next/link';
import type { CTAVariant } from '@/types/content';
import { trackCTAClick, trackWhatsAppClick } from '@/lib/tracking';
import { getWhatsAppUrl, type WhatsAppMessageKey } from '@/content/site';

interface ButtonProps {
  label: string;
  href?: string;
  variant?: CTAVariant;
  icon?: 'whatsapp' | 'arrow' | 'phone' | 'calendar';
  trackingSource?: string;
  className?: string;
  whatsappMessageKey?: WhatsAppMessageKey;
  size?: 'default' | 'large';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5">
    <path d="M5 15 15 5M7 5h8v8" />
  </svg>
);

const icons: Record<string, React.FC> = {
  whatsapp: WhatsAppIcon,
  arrow: ArrowIcon,
};

const variantClasses: Record<CTAVariant, string> = {
  primary:
    'border border-primary bg-primary text-[var(--accent-ink)] hover:border-primary-hover hover:bg-primary-hover shadow-glow',
  secondary:
    'border border-white/18 bg-white/[0.025] text-white/80 hover:border-primary/55 hover:bg-primary/[0.055] hover:text-white',
  ghost:
    'border border-transparent text-text-secondary hover:border-white/10 hover:bg-white/[0.035] hover:text-text-primary',
};

export function Button({
  label,
  href,
  variant = 'primary',
  icon,
  trackingSource,
  className = '',
  whatsappMessageKey,
  size = 'default',
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  const IconComponent = icon ? icons[icon] : null;
  const isWhatsApp = href === '#whatsapp' || icon === 'whatsapp';
  const finalHref = isWhatsApp
    ? getWhatsAppUrl(whatsappMessageKey || 'general')
    : href;
  const isExternal = finalHref?.startsWith('http') || finalHref?.startsWith('https');

  const sizeClass = size === 'large'
    ? 'min-h-14 px-6 py-4 text-[12px] sm:px-7'
    : 'min-h-11 px-5 py-3 text-xs';

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    if (trackingSource) {
      trackCTAClick(trackingSource);
    }
    if (isWhatsApp && trackingSource) {
      trackWhatsAppClick(trackingSource);
    }
  };

  const classes = `
    group/button inline-flex items-center justify-center gap-3 rounded-[var(--radius-button)]
    font-semibold uppercase tracking-[0.13em]
    transition-all duration-[var(--duration-normal)] cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5]
    ${sizeClass} ${variantClasses[variant]} ${className}
  `.trim();

  if (!finalHref) {
    return (
      <button
        type={type}
        disabled={disabled}
        className={classes}
        onClick={handleClick}
      >
        {IconComponent && <IconComponent />}
        {label}
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={finalHref}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={handleClick}
      >
        {IconComponent && <IconComponent />}
        {label}
      </a>
    );
  }

  return (
    <Link href={finalHref} className={classes} onClick={handleClick}>
      {IconComponent && <IconComponent />}
      {label}
    </Link>
  );
}
