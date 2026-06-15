export const SOCIAL_LINKS_SETTING_KEY = 'social.links';

export type SocialPlatform =
  | 'instagram'
  | 'googleBusiness'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'x'
  | 'github'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform | string;
  label: string;
  url: string;
  enabled: boolean;
  showInFooter: boolean;
  includeInSameAs: boolean;
  order: number;
}

export interface InstagramContentConfig {
  enabled: boolean;
  embedUrl: string;
  title: string;
}

export interface SocialContentEmbed {
  id: string;
  platform: SocialPlatform | string;
  title: string;
  embedUrl: string;
  enabled: boolean;
  order: number;
}

export interface SocialLinksConfig {
  links: SocialLink[];
  contentEmbeds: SocialContentEmbed[];
  instagramContent: InstagramContentConfig;
}

const defaultInstagramContent: InstagramContentConfig = {
  enabled: false,
  embedUrl: '',
  title: 'Latest from Instagram',
};

export const defaultSocialLinks: SocialLink[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    label: 'Instagram',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 10,
  },
  {
    id: 'google-business',
    platform: 'googleBusiness',
    label: 'Google Business',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 20,
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    label: 'LinkedIn',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 30,
  },
  {
    id: 'facebook',
    platform: 'facebook',
    label: 'Facebook',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 40,
  },
  {
    id: 'youtube',
    platform: 'youtube',
    label: 'YouTube',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 50,
  },
  {
    id: 'x',
    platform: 'x',
    label: 'X',
    url: '',
    enabled: false,
    showInFooter: true,
    includeInSameAs: true,
    order: 60,
  },
];

export const defaultSocialContentEmbeds: SocialContentEmbed[] = [
  { id: 'instagram-content', platform: 'instagram', title: 'Instagram post 1', embedUrl: '', enabled: false, order: 10 },
  { id: 'instagram-content-2', platform: 'instagram', title: 'Instagram post 2', embedUrl: '', enabled: false, order: 20 },
  { id: 'instagram-content-3', platform: 'instagram', title: 'Instagram post 3', embedUrl: '', enabled: false, order: 30 },
  { id: 'linkedin-content', platform: 'linkedin', title: 'LinkedIn post 1', embedUrl: '', enabled: false, order: 40 },
  { id: 'linkedin-content-2', platform: 'linkedin', title: 'LinkedIn post 2', embedUrl: '', enabled: false, order: 50 },
  { id: 'linkedin-content-3', platform: 'linkedin', title: 'LinkedIn post 3', embedUrl: '', enabled: false, order: 60 },
  { id: 'google-business-content', platform: 'googleBusiness', title: 'Google Business embed 1', embedUrl: '', enabled: false, order: 70 },
  { id: 'google-business-content-2', platform: 'googleBusiness', title: 'Google Business embed 2', embedUrl: '', enabled: false, order: 80 },
  { id: 'youtube-content', platform: 'youtube', title: 'YouTube video 1', embedUrl: '', enabled: false, order: 90 },
  { id: 'youtube-content-2', platform: 'youtube', title: 'YouTube video 2', embedUrl: '', enabled: false, order: 100 },
  { id: 'facebook-content', platform: 'facebook', title: 'Facebook update 1', embedUrl: '', enabled: false, order: 110 },
  { id: 'facebook-content-2', platform: 'facebook', title: 'Facebook update 2', embedUrl: '', enabled: false, order: 120 },
];

export const defaultSocialLinksConfig: SocialLinksConfig = {
  links: defaultSocialLinks,
  contentEmbeds: [],
  instagramContent: defaultInstagramContent,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeLink(value: unknown, fallback: SocialLink): SocialLink {
  if (!isRecord(value)) return fallback;
  const url = asString(value.url, fallback.url);

  return {
    id: asString(value.id, fallback.id),
    platform: asString(value.platform, fallback.platform),
    label: asString(value.label, fallback.label),
    url,
    enabled: Boolean(url),
    showInFooter: asBoolean(value.showInFooter, fallback.showInFooter),
    includeInSameAs: asBoolean(value.includeInSameAs, fallback.includeInSameAs),
    order: asNumber(value.order, fallback.order),
  };
}

function normalizeInstagramContent(value: unknown): InstagramContentConfig {
  if (!isRecord(value)) return defaultInstagramContent;

  return {
    enabled: asBoolean(value.enabled, defaultInstagramContent.enabled),
    embedUrl: asString(value.embedUrl, defaultInstagramContent.embedUrl),
    title: asString(value.title, defaultInstagramContent.title),
  };
}

function normalizeContentEmbed(value: unknown, fallback: SocialContentEmbed): SocialContentEmbed {
  if (!isRecord(value)) return fallback;
  const embedUrl = asString(value.embedUrl, fallback.embedUrl);

  return {
    id: asString(value.id, fallback.id),
    platform: asString(value.platform, fallback.platform),
    title: asString(value.title, fallback.title),
    embedUrl,
    enabled: Boolean(embedUrl) && asBoolean(value.enabled, fallback.enabled),
    order: asNumber(value.order, fallback.order),
  };
}

export function normalizeSocialLinksConfig(value: unknown): SocialLinksConfig {
  if (!isRecord(value)) return defaultSocialLinksConfig;

  const rawLinks = Array.isArray(value.links) ? value.links : [];
  const normalizedDefaults = defaultSocialLinks.map((fallback) => {
    const saved = rawLinks.find((item) => isRecord(item) && item.id === fallback.id);
    return normalizeLink(saved, fallback);
  });

  const customLinks = rawLinks
    .filter((item) => isRecord(item) && !defaultSocialLinks.some((fallback) => fallback.id === item.id))
    .map((item, index) =>
      normalizeLink(item, {
        id: `custom-${index + 1}`,
        platform: 'other',
        label: 'External profile',
        url: '',
        enabled: false,
        showInFooter: true,
        includeInSameAs: true,
        order: 100 + index,
      }),
    );

  const legacyInstagramContent = normalizeInstagramContent(value.instagramContent);
  const rawContentEmbeds = Array.isArray(value.contentEmbeds) ? value.contentEmbeds : [];
  const contentEmbeds = rawContentEmbeds.map((item, index) =>
    normalizeContentEmbed(item, {
      id: `content-${index + 1}`,
      platform: 'other',
      title: 'Social content',
      embedUrl: '',
      enabled: false,
      order: 10 + index * 10,
    }),
  );

  if (contentEmbeds.length === 0 && legacyInstagramContent.enabled && legacyInstagramContent.embedUrl) {
    contentEmbeds.push({
      id: 'instagram-content',
      platform: 'instagram',
      title: legacyInstagramContent.title,
      embedUrl: legacyInstagramContent.embedUrl,
      enabled: true,
      order: 10,
    });
  }

  return {
    links: [...normalizedDefaults, ...customLinks].sort((a, b) => a.order - b.order),
    contentEmbeds: contentEmbeds.sort((a, b) => a.order - b.order),
    instagramContent: legacyInstagramContent,
  };
}

export function enabledFooterSocialLinks(config: SocialLinksConfig) {
  return config.links
    .filter((link) => link.enabled && link.showInFooter && link.url)
    .sort((a, b) => a.order - b.order);
}

export function sameAsSocialUrls(config: SocialLinksConfig) {
  return config.links
    .filter((link) => link.enabled && link.includeInSameAs && link.url)
    .map((link) => link.url);
}

export function enabledSocialContentEmbeds(config: SocialLinksConfig) {
  return config.contentEmbeds
    .filter((embed) => embed.enabled && embed.embedUrl)
    .sort((a, b) => a.order - b.order);
}
