/** Original acquisition context for this tab session, shared by analytics and enquiries. */
interface AcquisitionContext {
  landingPage: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}
let memoryContext: AcquisitionContext | undefined;
const key = 'cb_acquisition_context';

export function getSessionAcquisition(): AcquisitionContext {
  const params = new URLSearchParams(window.location.search);
  let referrer = document.referrer.slice(0, 500);
  try {
    const referringHost = new URL(referrer).hostname.replace(/^www\./, '');
    const currentHost = window.location.hostname.replace(/^www\./, '');
    if (referringHost === currentHost) referrer = '';
  } catch { /* Missing or invalid referrer is not an external referral. */ }
  const current: AcquisitionContext = {
    landingPage: window.location.pathname,
    referrer,
    utmSource: params.get('utm_source')?.slice(0, 120),
    utmMedium: params.get('utm_medium')?.slice(0, 120),
    utmCampaign: params.get('utm_campaign')?.slice(0, 120),
    utmTerm: params.get('utm_term')?.slice(0, 120),
    utmContent: params.get('utm_content')?.slice(0, 120),
  };
  try {
    const raw = window.sessionStorage.getItem(key);
    const stored = raw ? JSON.parse(raw) as AcquisitionContext : undefined;
    if (stored && typeof stored.landingPage === 'string' && typeof stored.referrer === 'string') {
      return stored;
    }
    window.sessionStorage.setItem(key, JSON.stringify(current));
  } catch {
    // Storage failure must never prevent an enquiry. Memory survives client navigation only.
    memoryContext ??= current;
    return memoryContext;
  }
  return current;
}
