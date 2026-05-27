export const industries = [
  'HEALTHCARE',
  'ECOMMERCE',
  'HRMS',
  'CUSTOM_DEVELOPMENT',
  'GENERAL',
] as const;

export type SeoIndustry = (typeof industries)[number];

export const trafficChannels = [
  'ORGANIC_SEARCH',
  'AI_REFERRAL',
  'DIRECT',
  'REFERRAL',
  'SOCIAL',
  'PAID',
  'UNKNOWN',
] as const;

export type TrafficChannel = (typeof trafficChannels)[number];

export const industryLabels: Record<SeoIndustry, string> = {
  HEALTHCARE: 'Healthcare',
  ECOMMERCE: 'E-commerce',
  HRMS: 'HRMS',
  CUSTOM_DEVELOPMENT: 'Custom development',
  GENERAL: 'General',
};

export const coreIndustries: SeoIndustry[] = [
  'HEALTHCARE',
  'ECOMMERCE',
  'HRMS',
  'CUSTOM_DEVELOPMENT',
];

const industryRules: Array<{ industry: SeoIndustry; includes: string[] }> = [
  {
    industry: 'HEALTHCARE',
    includes: [
      'healthcare',
      'clinic',
      'patient',
      'physioway',
      'physioways',
      'shashwat',
      'ivf',
      'django-powers-healthcare',
    ],
  },
  {
    industry: 'ECOMMERCE',
    includes: [
      'ecommerce',
      'e-commerce',
      'commerce',
      'inventory',
      'order-management',
      'razorpay',
      'shiprocket',
      'shopify',
      'react-nextjs-seo-first-ecommerce',
    ],
  },
  {
    industry: 'HRMS',
    includes: [
      'hrms',
      'payroll',
      'attendance',
      'employee',
      'leave',
      'building-hrms-that-scales',
    ],
  },
  {
    industry: 'CUSTOM_DEVELOPMENT',
    includes: [
      'custom-business',
      'custom-systems',
      'custom-development',
      'business-systems',
      'workflow',
      'internal-crm',
      'dashboard',
      'approval',
      'anr',
      'mechanical',
      'saas-vs-custom',
    ],
  },
];

const organicSearchHosts = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'yandex.', 'baidu.', 'ecosia.'];
const aiReferralHosts = ['chatgpt.', 'openai.', 'perplexity.', 'gemini.', 'bard.', 'claude.', 'poe.', 'copilot.'];
const socialHosts = ['linkedin.', 'facebook.', 'instagram.', 'x.com', 'twitter.', 'youtube.', 'reddit.'];

export function normalizePath(input?: string | null) {
  if (!input) return '/';

  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const url = new URL(input);
      return url.pathname || '/';
    }
  } catch {
    return '/';
  }

  const [path] = input.split(/[?#]/);
  return path.startsWith('/') ? path || '/' : `/${path}`;
}

export function getIndustryForPath(path?: string | null): SeoIndustry {
  const normalized = normalizePath(path).toLowerCase();
  const rule = industryRules.find(({ includes }) => includes.some((part) => normalized.includes(part)));
  return rule?.industry ?? 'GENERAL';
}

export function getIndustryForServiceInterest(serviceInterest?: string | null): SeoIndustry {
  if (serviceInterest === 'HEALTHCARE') return 'HEALTHCARE';
  if (serviceInterest === 'ECOMMERCE') return 'ECOMMERCE';
  if (serviceInterest === 'HRMS') return 'HRMS';
  if (serviceInterest === 'CUSTOM_SYSTEMS') return 'CUSTOM_DEVELOPMENT';
  return 'GENERAL';
}

export function getTrafficChannel(referrer?: string | null, utmMedium?: string | null, utmSource?: string | null): TrafficChannel {
  const medium = utmMedium?.toLowerCase() ?? '';
  const source = utmSource?.toLowerCase() ?? '';
  const referrerHost = getHost(referrer);

  if (['cpc', 'ppc', 'paid', 'paid_search', 'display', 'ads'].some((term) => medium.includes(term))) {
    return 'PAID';
  }

  if (!referrerHost && !source && !medium) return 'DIRECT';

  if (includesAny(`${referrerHost} ${source}`, aiReferralHosts)) return 'AI_REFERRAL';
  if (includesAny(`${referrerHost} ${source}`, organicSearchHosts) || medium === 'organic') return 'ORGANIC_SEARCH';
  if (includesAny(`${referrerHost} ${source}`, socialHosts) || medium === 'social') return 'SOCIAL';

  return referrerHost || source || medium ? 'REFERRAL' : 'UNKNOWN';
}

export function getLandingPage(currentPage?: string | null, storedLandingPage?: string | null) {
  return normalizePath(storedLandingPage || currentPage || '/');
}

function getHost(value?: string | null) {
  if (!value) return '';

  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return value.replace(/^www\./, '').toLowerCase();
  }
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
