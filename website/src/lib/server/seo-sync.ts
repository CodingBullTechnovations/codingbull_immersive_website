import { SeoSyncProvider } from '@prisma/client';
import { getIndustryForPath, getTrafficChannel, normalizePath } from '@/lib/industry';
import { getIntegrationValue, upsertCredential } from '@/lib/server/credentials';
import { prisma } from '@/lib/server/prisma';

const googleScopes = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];

export function getGoogleScopes() {
  return googleScopes;
}

export async function getGoogleOAuthConfig() {
  const [clientId, clientSecret] = await Promise.all([
    getIntegrationValue('GOOGLE', 'client_id', 'GOOGLE_CLIENT_ID'),
    getIntegrationValue('GOOGLE', 'client_secret', 'GOOGLE_CLIENT_SECRET'),
  ]);

  return { clientId, clientSecret };
}

export async function exchangeGoogleCode(input: { code: string; redirectUri: string }) {
  const { clientId, clientSecret } = await getGoogleOAuthConfig();
  if (!clientId || !clientSecret) throw new Error('Google OAuth client_id/client_secret are missing.');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: input.code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error_description || json.error || 'Google token exchange failed.');

  if (json.refresh_token) {
    await upsertCredential({ provider: 'GOOGLE', key: 'refresh_token', value: json.refresh_token, status: 'VERIFIED' });
  }

  if (json.access_token) {
    await upsertCredential({ provider: 'GOOGLE', key: 'access_token', value: json.access_token, status: 'VERIFIED' });
  }

  return json as { access_token: string; refresh_token?: string; expires_in?: number };
}

async function getGoogleAccessToken() {
  const { clientId, clientSecret } = await getGoogleOAuthConfig();
  const refreshToken = await getIntegrationValue('GOOGLE', 'refresh_token', 'GOOGLE_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials are missing. Save client_id, client_secret, and connect OAuth.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error_description || json.error || 'Google refresh token failed.');

  return String(json.access_token);
}

export async function runSearchConsoleSync({ days = 30 }: { days?: number } = {}) {
  const provider = SeoSyncProvider.SEARCH_CONSOLE;
  await markAttempt(provider);

  try {
    const siteUrl = await getIntegrationValue('SEARCH_CONSOLE', 'site_url', 'GOOGLE_SEARCH_CONSOLE_SITE_URL');
    if (!siteUrl) throw new Error('Search Console site_url is missing.');

    const accessToken = await getGoogleAccessToken();
    let rowsImported = 0;

    for (const date of lastNDates(days)) {
      const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: date,
          endDate: date,
          dimensions: ['query', 'page', 'country', 'device'],
          rowLimit: 25000,
        }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error?.message || 'Search Console sync failed.');

      for (const row of json.rows ?? []) {
        const [query, page, country, device] = row.keys ?? [];
        if (!query || !page) continue;

        await prisma.searchPerformanceDaily.upsert({
          where: {
            date_query_page_country_device: {
              date: parseSyncDate(date),
              query,
              page,
              country: country || 'ALL',
              device: device || 'ALL',
            },
          },
          create: {
            date: parseSyncDate(date),
            query,
            page,
            country: country || 'ALL',
            device: device || 'ALL',
            industry: getIndustryForPath(page),
            clicks: Number(row.clicks ?? 0),
            impressions: Number(row.impressions ?? 0),
            ctr: Number(row.ctr ?? 0),
            averagePosition: Number(row.position ?? 0),
          },
          update: {
            industry: getIndustryForPath(page),
            clicks: Number(row.clicks ?? 0),
            impressions: Number(row.impressions ?? 0),
            ctr: Number(row.ctr ?? 0),
            averagePosition: Number(row.position ?? 0),
          },
        });
        rowsImported += 1;
      }
    }

    await markSuccess(provider, rowsImported);
    return { ok: true, rowsImported };
  } catch (error) {
    await markError(provider, error);
    throw error;
  }
}

export async function runGa4Sync({ days = 30 }: { days?: number } = {}) {
  const provider = SeoSyncProvider.GA4;
  await markAttempt(provider);

  try {
    const propertyId = await getIntegrationValue('GA4', 'property_id', 'GA4_PROPERTY_ID');
    if (!propertyId) throw new Error('GA4 property_id is missing.');

    const accessToken = await getGoogleAccessToken();
    const normalizedProperty = propertyId.startsWith('properties/') ? propertyId : `properties/${propertyId}`;
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/${normalizedProperty}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [
          { name: 'date' },
          { name: 'landingPagePlusQueryString' },
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'engagedSessions' },
          { name: 'totalUsers' },
          { name: 'conversions' },
        ],
        limit: 25000,
      }),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error?.message || 'GA4 sync failed.');

    let rowsImported = 0;

    for (const row of json.rows ?? []) {
      const dimensions = row.dimensionValues?.map((item: { value?: string }) => item.value ?? '') ?? [];
      const metrics = row.metricValues?.map((item: { value?: string }) => Number(item.value ?? 0)) ?? [];
      const [dateRaw, landingPageRaw, sourceRaw, mediumRaw] = dimensions;
      const landingPage = normalizePath(landingPageRaw || '/');
      const source = sourceRaw || 'unknown';
      const medium = mediumRaw || 'unknown';

      await prisma.ga4LandingPageDaily.upsert({
        where: {
          date_landingPage_source_medium: {
            date: parseGa4Date(dateRaw),
            landingPage,
            source,
            medium,
          },
        },
        create: {
          date: parseGa4Date(dateRaw),
          landingPage,
          source,
          medium,
          trafficChannel: getTrafficChannel(null, medium, source),
          industry: getIndustryForPath(landingPage),
          sessions: Math.trunc(metrics[0] ?? 0),
          engagedSessions: Math.trunc(metrics[1] ?? 0),
          users: Math.trunc(metrics[2] ?? 0),
          conversions: Math.trunc(metrics[3] ?? 0),
        },
        update: {
          trafficChannel: getTrafficChannel(null, medium, source),
          industry: getIndustryForPath(landingPage),
          sessions: Math.trunc(metrics[0] ?? 0),
          engagedSessions: Math.trunc(metrics[1] ?? 0),
          users: Math.trunc(metrics[2] ?? 0),
          conversions: Math.trunc(metrics[3] ?? 0),
        },
      });
      rowsImported += 1;
    }

    await markSuccess(provider, rowsImported);
    return { ok: true, rowsImported };
  } catch (error) {
    await markError(provider, error);
    throw error;
  }
}

async function markAttempt(provider: SeoSyncProvider) {
  await prisma.seoSyncStatus.upsert({
    where: { provider },
    create: { provider, lastAttemptedAt: new Date() },
    update: { lastAttemptedAt: new Date() },
  });
}

async function markSuccess(provider: SeoSyncProvider, rowsImported: number) {
  await prisma.seoSyncStatus.upsert({
    where: { provider },
    create: { provider, lastAttemptedAt: new Date(), lastSuccessfulAt: new Date(), rowsImported },
    update: {
      lastSuccessfulAt: new Date(),
      lastError: null,
      rowsImported: { increment: rowsImported },
    },
  });
}

async function markError(provider: SeoSyncProvider, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown sync error';
  await prisma.seoSyncStatus.upsert({
    where: { provider },
    create: { provider, lastAttemptedAt: new Date(), lastError: message },
    update: { lastError: message },
  });
}

function lastNDates(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });
}

function parseSyncDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function parseGa4Date(value: string) {
  if (/^\d{8}$/.test(value)) {
    return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00.000Z`);
  }
  return parseSyncDate(value.slice(0, 10));
}
