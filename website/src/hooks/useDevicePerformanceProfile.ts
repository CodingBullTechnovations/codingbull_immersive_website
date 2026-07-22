import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type DevicePerformanceProfile = 'pending' | 'desktop' | 'mobilePremium' | 'reducedMotion';

const MOBILE_PREMIUM_QUERY = '(hover: none), (pointer: coarse), (max-width: 1023px)';

type NetworkInformationLike = EventTarget & { saveData?: boolean };
type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike };

export function useDevicePerformanceProfile(): DevicePerformanceProfile {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMobilePremium, setIsMobilePremium] = useState<boolean | null>(null);
  const [prefersDataSaving, setPrefersDataSaving] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_PREMIUM_QUERY);
    const update = () => setIsMobilePremium(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    if (!connection) return;
    const update = () => setPrefersDataSaving(Boolean(connection.saveData));
    update();
    connection.addEventListener('change', update);
    return () => connection.removeEventListener('change', update);
  }, []);

  if (prefersReducedMotion || prefersDataSaving) return 'reducedMotion';
  if (isMobilePremium === null) return 'pending';
  return isMobilePremium ? 'mobilePremium' : 'desktop';
}
