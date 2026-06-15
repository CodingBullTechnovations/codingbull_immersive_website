'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CredentialProvider, Prisma } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { writeAuditLog } from '@/lib/server/audit';
import { deleteCredential, upsertCredential } from '@/lib/server/credentials';
import { getGoogleSyncReadiness, normalizeGa4PropertyId, normalizeSearchConsoleSiteUrl } from '@/lib/server/google-sync-readiness';
import { runGa4Sync, runSearchConsoleSync } from '@/lib/server/seo-sync';
import { prisma } from '@/lib/server/prisma';
import {
  defaultSocialContentEmbeds,
  defaultSocialLinks,
  normalizeSocialLinksConfig,
  SOCIAL_LINKS_SETTING_KEY,
  type SocialContentEmbed,
  type SocialLink,
} from '@/lib/social-links';

const providerSchema = z.nativeEnum(CredentialProvider);
const credentialKeySchema = z.string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_.-]+$/);
const ga4MeasurementIdSchema = z.string().trim().transform((value) => value.toUpperCase()).pipe(z.string().regex(/^G-[A-Z0-9]+$/));

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function normalizeCredentialValue(provider: CredentialProvider, key: string, value: string) {
  if (provider === 'GA4' && key === 'measurement_id') {
    const result = ga4MeasurementIdSchema.safeParse(value);
    if (!result.success) {
      return {
        ok: false as const,
        reason: 'GA4 measurement ID must look like G-MSG359QMVM.',
      };
    }
    return { ok: true as const, value: result.data };
  }

  if (provider === 'GA4' && key === 'property_id') {
    return normalizeGa4PropertyId(value);
  }

  if (provider === 'SEARCH_CONSOLE' && key === 'site_url') {
    return normalizeSearchConsoleSiteUrl(value);
  }

  if (provider === 'GOOGLE' && key === 'refresh_token') {
    return {
      ok: false as const,
      reason: 'Google refresh token is generated only through the OAuth callback. Use Connect Google OAuth.',
    };
  }

  return { ok: true as const, value };
}

function normalizeHttpsUrl(rawValue: string, fieldLabel: string) {
  const value = rawValue.trim();
  if (!value) return '';

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${fieldLabel} must be a valid URL.`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`${fieldLabel} must use HTTPS.`);
  }

  return url.toString();
}

function normalizeInstagramEmbedUrl(rawValue: string) {
  const value = normalizeHttpsUrl(rawValue, 'Instagram embed URL');
  if (!value) return '';

  const url = new URL(value);
  const hostname = url.hostname.replace(/^www\./, '');
  if (hostname !== 'instagram.com') {
    throw new Error('Instagram embed URL must be hosted on instagram.com.');
  }

  const parts = url.pathname.split('/').filter(Boolean);
  const contentType = parts[0];
  const shortcode = parts[1];
  const supportedContentType = contentType === 'p' || contentType === 'reel' || contentType === 'tv';

  if (supportedContentType && shortcode) {
    return `https://www.instagram.com/${contentType}/${shortcode}/embed/captioned/`;
  }

  if (parts.includes('embed')) {
    return url.toString();
  }

  throw new Error('Use an Instagram post, reel, TV, or official embed URL. Profile feed embeds require an approved API integration.');
}

function normalizeYoutubeEmbedUrl(url: URL) {
  const hostname = url.hostname.replace(/^www\./, '');

  if (hostname === 'youtu.be') {
    const videoId = url.pathname.split('/').filter(Boolean)[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  if (hostname === 'youtube.com') {
    if (url.pathname.startsWith('/embed/')) return url.toString();
    const videoId = url.searchParams.get('v');
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  throw new Error('YouTube content must use a YouTube video, short link, or official embed URL.');
}

function normalizeOfficialEmbedUrl(rawValue: string, platform: string, fieldLabel: string) {
  const value = normalizeHttpsUrl(rawValue, fieldLabel);
  if (!value) return '';

  const url = new URL(value);
  const hostname = url.hostname.replace(/^www\./, '');

  switch (platform) {
    case 'instagram':
      return normalizeInstagramEmbedUrl(value);
    case 'linkedin':
      if ((hostname === 'linkedin.com' || hostname === 'www.linkedin.com') && url.pathname.startsWith('/embed/')) {
        return url.toString();
      }
      throw new Error('LinkedIn content must use an official LinkedIn embed URL starting with https://www.linkedin.com/embed/.');
    case 'googleBusiness':
      if ((hostname === 'google.com' || hostname === 'maps.google.com') && url.pathname.startsWith('/maps/embed')) {
        return url.toString();
      }
      throw new Error('Google content must use an official Google Maps embed URL. Google review feeds require a separate approved API/widget integration.');
    case 'youtube':
      return normalizeYoutubeEmbedUrl(url);
    case 'facebook':
      if ((hostname === 'facebook.com' || hostname === 'www.facebook.com') && url.pathname.startsWith('/plugins/')) {
        return url.toString();
      }
      throw new Error('Facebook content must use an official Facebook plugins embed URL.');
    default:
      throw new Error(`${fieldLabel} uses an unsupported embed platform. Add it to the approved provider list before embedding.`);
  }
}

function socialPlatformFromForm(formData: FormData, id: string) {
  return text(formData, `social_platform_${id}`) || 'other';
}

function socialLinkFromForm(formData: FormData, fallback: SocialLink): SocialLink {
  const url = normalizeHttpsUrl(text(formData, `social_url_${fallback.id}`), `${fallback.label} URL`);

  return {
    id: fallback.id,
    platform: socialPlatformFromForm(formData, fallback.id),
    label: text(formData, `social_label_${fallback.id}`) || fallback.label,
    url,
    enabled: Boolean(url),
    showInFooter: checked(formData, `social_footer_${fallback.id}`),
    includeInSameAs: checked(formData, `social_same_as_${fallback.id}`),
    order: Number(text(formData, `social_order_${fallback.id}`)) || fallback.order,
  };
}

function slugId(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
}

function parseAdditionalSocialLinks(rawValue: string): SocialLink[] {
  if (!rawValue.trim()) return [];

  return rawValue
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelRaw, platformRaw, urlRaw, footerRaw = 'true', sameAsRaw = 'true'] = line
        .split('|')
        .map((part) => part.trim());
      const label = labelRaw || `External profile ${index + 1}`;
      const url = normalizeHttpsUrl(urlRaw || '', `${label} URL`);

      if (!url) {
        throw new Error(`${label} is enabled but has no URL.`);
      }

      return {
        id: `custom-${slugId(label, String(index + 1))}`,
        platform: platformRaw || 'other',
        label,
        url,
        enabled: Boolean(url),
        showInFooter: footerRaw.toLowerCase() !== 'false',
        includeInSameAs: sameAsRaw.toLowerCase() !== 'false',
        order: 100 + index,
      };
    });
}

function contentEmbedFromForm(formData: FormData, fallback: SocialContentEmbed): SocialContentEmbed {
  const embedUrl = normalizeOfficialEmbedUrl(
    text(formData, `content_embed_url_${fallback.id}`),
    fallback.platform,
    `${fallback.title} embed URL`,
  );

  return {
    id: fallback.id,
    platform: fallback.platform,
    title: text(formData, `content_title_${fallback.id}`) || fallback.title,
    embedUrl,
    enabled: Boolean(embedUrl) && checked(formData, `content_enabled_${fallback.id}`),
    order: Number(text(formData, `content_order_${fallback.id}`)) || fallback.order,
  };
}

function parseAdditionalContentEmbeds(rawValue: string): SocialContentEmbed[] {
  if (!rawValue.trim()) return [];

  return rawValue
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [titleRaw, platformRaw, embedUrlRaw, enabledRaw = 'true', orderRaw] = line
        .split('|')
        .map((part) => part.trim());
      const title = titleRaw || `Social content ${index + 1}`;
      const platform = platformRaw || 'other';
      const embedUrl = normalizeOfficialEmbedUrl(embedUrlRaw || '', platform, `${title} embed URL`);

      if (!embedUrl) {
        throw new Error(`${title} is enabled but has no embed URL.`);
      }

      return {
        id: `content-custom-${slugId(title, String(index + 1))}`,
        platform,
        title,
        embedUrl,
        enabled: enabledRaw.toLowerCase() !== 'false',
        order: Number(orderRaw) || 200 + index,
      };
    });
}

export async function saveCredentialAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');

  const provider = providerSchema.parse(text(formData, 'provider'));
  const key = credentialKeySchema.parse(text(formData, 'key'));
  const value = z.string().min(1).parse(text(formData, 'value'));
  const normalized = normalizeCredentialValue(provider, key, value);

  if (!normalized.ok) {
    redirect(`/admin/settings?integration=credential_invalid&reason=${encodeURIComponent(normalized.reason)}`);
  }

  const credential = await upsertCredential({
    provider,
    key,
    value: normalized.value,
    status: 'FORMAT_VALID',
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'credential.save',
    entityType: 'IntegrationCredential',
    entityId: credential.id,
    afterSummary: {
      provider,
      key,
      status: credential.status,
      maskedValue: credential.maskedValue,
    },
  });

  revalidatePath('/admin/settings');
  redirect('/admin/settings?integration=credential_saved');
}

export async function deleteCredentialAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');

  const id = z.string().min(5).parse(text(formData, 'id'));
  const deleted = await deleteCredential(id);

  await writeAuditLog({
    actorId: session.user.id,
    action: 'credential.delete',
    entityType: 'IntegrationCredential',
    entityId: id,
    beforeSummary: {
      provider: deleted.provider,
      key: deleted.key,
      status: deleted.status,
      maskedValue: deleted.maskedValue,
    },
    afterSummary: { deleted: true },
  });

  revalidatePath('/admin/settings');
  redirect('/admin/settings?integration=credential_deleted');
}

export async function syncSearchConsoleAction() {
  await requireAdmin('ADMIN');

  let target = '/admin/settings?integration=search_console_synced';
  try {
    const readiness = await getGoogleSyncReadiness();
    if (!readiness.searchConsole.ready) throw new Error(readiness.searchConsole.reason);

    const result = await runSearchConsoleSync({ days: 30 });
    target = `/admin/settings?integration=search_console_synced&rows=${result.rowsImported}`;
  } catch (error) {
    console.error('[search_console_sync_failed]', error instanceof Error ? error.message : error);
    target = `/admin/settings?integration=search_console_sync_failed&reason=${encodeURIComponent(
      error instanceof Error ? error.message : 'Search Console sync failed',
    )}`;
  }

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/settings');
  redirect(target);
}

export async function syncGa4Action() {
  await requireAdmin('ADMIN');

  let target = '/admin/settings?integration=ga4_synced';
  try {
    const readiness = await getGoogleSyncReadiness();
    if (!readiness.ga4.ready) throw new Error(readiness.ga4.reason);

    const result = await runGa4Sync({ days: 30 });
    target = `/admin/settings?integration=ga4_synced&rows=${result.rowsImported}`;
  } catch (error) {
    console.error('[ga4_sync_failed]', error instanceof Error ? error.message : error);
    target = `/admin/settings?integration=ga4_sync_failed&reason=${encodeURIComponent(
      error instanceof Error ? error.message : 'GA4 sync failed',
    )}`;
  }

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/settings');
  redirect(target);
}

export async function saveSocialLinksAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');

  let target = '/admin/settings?integration=social_saved';

  try {
    const links = [
      ...defaultSocialLinks.map((fallback) => socialLinkFromForm(formData, fallback)),
      ...parseAdditionalSocialLinks(text(formData, 'additionalSocialLinks')),
    ].sort((a, b) => a.order - b.order);

    const contentEmbeds = [
      ...defaultSocialContentEmbeds.map((fallback) => contentEmbedFromForm(formData, fallback)),
      ...parseAdditionalContentEmbeds(text(formData, 'additionalContentEmbeds')),
    ].sort((a, b) => a.order - b.order);

    const parsed = normalizeSocialLinksConfig({
      links,
      contentEmbeds,
      instagramContent: {
        enabled: false,
        embedUrl: '',
        title: 'Latest from Instagram',
      },
    });

    const saved = await prisma.siteSetting.upsert({
      where: { key: SOCIAL_LINKS_SETTING_KEY },
      update: {
        value: parsed as unknown as Prisma.InputJsonValue,
        description: 'Backend-managed public social profiles and approved social content embeds.',
      },
      create: {
        key: SOCIAL_LINKS_SETTING_KEY,
        value: parsed as unknown as Prisma.InputJsonValue,
        description: 'Backend-managed public social profiles and approved social content embeds.',
      },
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'setting.social_links.upsert',
      entityType: 'SiteSetting',
      entityId: saved.id,
      afterSummary: {
        key: SOCIAL_LINKS_SETTING_KEY,
        enabledLinks: parsed.links.filter((link) => link.enabled).map((link) => link.label),
        enabledContentEmbeds: parsed.contentEmbeds.filter((embed) => embed.enabled).map((embed) => embed.title),
      },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Social link settings were not saved.';
    target = `/admin/settings?integration=social_invalid&reason=${encodeURIComponent(reason)}`;
  }

  redirect(target);
}
