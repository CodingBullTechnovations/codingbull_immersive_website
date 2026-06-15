import { cache } from 'react';
import { prisma, isDatabaseConfigured } from '@/lib/server/prisma';
import {
  defaultSocialLinksConfig,
  normalizeSocialLinksConfig,
  SOCIAL_LINKS_SETTING_KEY,
} from '@/lib/social-links';

export const getPublicSocialLinksConfig = cache(async () => {
  if (!isDatabaseConfigured()) return defaultSocialLinksConfig;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: SOCIAL_LINKS_SETTING_KEY },
    });

    return normalizeSocialLinksConfig(setting?.value);
  } catch (error) {
    console.error('[social_links_query_failed]', error);
    return defaultSocialLinksConfig;
  }
});
