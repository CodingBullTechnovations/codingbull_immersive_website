'use client';

import { trackEmailClick, trackPhoneClick } from '@/lib/tracking';

interface TrackedContactLinkProps {
  href: `mailto:${string}` | `tel:${string}`;
  children: React.ReactNode;
  className?: string;
  source: string;
}

export function TrackedContactLink({ href, children, className, source }: TrackedContactLinkProps) {
  const handleClick = () => {
    if (href.startsWith('tel:')) {
      trackPhoneClick(source);
      return;
    }
    trackEmailClick(source);
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
