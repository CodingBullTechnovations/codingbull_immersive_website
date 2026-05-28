import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type DevicePerformanceProfile = 'desktop' | 'mobilePremium' | 'reducedMotion';

const MOBILE_PREMIUM_QUERY = '(hover: none), (pointer: coarse), (max-width: 1023px)';

export function useDevicePerformanceProfile(): DevicePerformanceProfile {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMobilePremium, setIsMobilePremium] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_PREMIUM_QUERY);
    const update = () => setIsMobilePremium(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  if (prefersReducedMotion) return 'reducedMotion';
  return isMobilePremium ? 'mobilePremium' : 'desktop';
}
