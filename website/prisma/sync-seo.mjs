import { createDecipheriv, createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function key() {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) throw new Error('Set CREDENTIAL_ENCRYPTION_KEY or AUTH_SECRET.');
  return createHash('sha256').update(secret).digest();
}

function decrypt(value) {
  const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivRaw, 'base64'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

async function credential(provider, name, envKey) {
  const row = await prisma.integrationCredential.findUnique({
    where: { provider_key: { provider, key: name } },
  }).catch(() => null);
  return row ? decrypt(row.encryptedValue) : (envKey ? process.env[envKey] ?? '' : '');
}

function industryFor(page) {
  const value = page.toLowerCase();
  if (value.includes('healthcare') || value.includes('clinic') || value.includes('patient') || value.includes('physioway') || value.includes('shashwat') || value.includes('ivf')) return 'HEALTHCARE';
  if (value.includes('ecommerce') || value.includes('e-commerce') || value.includes('commerce') || value.includes('inventory') || value.includes('shopify') || value.includes('order')) return 'ECOMMERCE';
  if (value.includes('hrms') || value.includes('payroll') || value.includes('attendance') || value.includes('employee') || value.includes('leave')) return 'HRMS';
  if (value.includes('custom') || value.includes('workflow') || value.includes('anr')) return 'CUSTOM_DEVELOPMENT';
  return 'GENERAL';
}

function channel(source, medium) {
  const value = `${source} ${medium}`.toLowerCase();
  if (value.includes('organic') || value.includes('google') || value.includes('bing')) return 'ORGANIC_SEARCH';
  if (value.includes('chatgpt') || value.includes('perplexity') || value.includes('claude') || value.includes('gemini')) return 'AI_REFERRAL';
  if (value.includes('cpc') || value.includes('paid')) return 'PAID';
  if (value.includes('social') || value.includes('linkedin') || value.includes('instagram')) return 'SOCIAL';
  return source || medium ? 'REFERRAL' : 'DIRECT';
}

async function accessToken() {
  const clientId = await credential('GOOGLE', 'client_id', 'GOOGLE_CLIENT_ID');
  const clientSecret = await credential('GOOGLE', 'client_secret', 'GOOGLE_CLIENT_SECRET');
  const refreshToken = await credential('GOOGLE', 'refresh_token', 'GOOGLE_REFRESH_TOKEN');
  if (!clientId || !clientSecret || !refreshToken) throw new Error('Missing Google OAuth credentials.');

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
  if (!response.ok) throw new Error(json.error_description || json.error || 'Google token refresh failed.');
  return json.access_token;
}

function dates(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });
}

async function mark(provider, data) {
  const createData = { ...data };
  if (typeof createData.rowsImported === 'object') {
    createData.rowsImported = createData.rowsImported.increment ?? 0;
  }

  await prisma.seoSyncStatus.upsert({
    where: { provider },
    create: { provider, ...createData },
    update: data,
  });
}

async function syncSearchConsole(days, token) {
  const provider = 'SEARCH_CONSOLE';
  await mark(provider, { lastAttemptedAt: new Date() });
  const siteUrl = await credential('SEARCH_CONSOLE', 'site_url', 'GOOGLE_SEARCH_CONSOLE_SITE_URL');
  if (!siteUrl) throw new Error('Missing Search Console site_url.');
  let imported = 0;

  for (const date of dates(days)) {
    const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: date, endDate: date, dimensions: ['query', 'page', 'country', 'device'], rowLimit: 25000 }),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error?.message || 'Search Console sync failed.');

    for (const row of json.rows ?? []) {
      const [query, page, country, device] = row.keys ?? [];
      if (!query || !page) continue;
      await prisma.searchPerformanceDaily.upsert({
        where: { date_query_page_country_device: { date: new Date(`${date}T00:00:00.000Z`), query, page, country: country || 'ALL', device: device || 'ALL' } },
        create: { date: new Date(`${date}T00:00:00.000Z`), query, page, country: country || 'ALL', device: device || 'ALL', industry: industryFor(page), clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, averagePosition: row.position ?? 0 },
        update: { industry: industryFor(page), clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, averagePosition: row.position ?? 0 },
      });
      imported += 1;
    }
  }

  await mark(provider, { lastSuccessfulAt: new Date(), lastError: null, rowsImported: { increment: imported } });
  return imported;
}

async function syncGa4(days, token) {
  const provider = 'GA4';
  await mark(provider, { lastAttemptedAt: new Date() });
  const propertyId = await credential('GA4', 'property_id', 'GA4_PROPERTY_ID');
  if (!propertyId) throw new Error('Missing GA4 property_id.');
  const property = propertyId.startsWith('properties/') ? propertyId : `properties/${propertyId}`;
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/${property}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'date' }, { name: 'landingPagePlusQueryString' }, { name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'totalUsers' }, { name: 'conversions' }],
      limit: 25000,
    }),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error?.message || 'GA4 sync failed.');
  let imported = 0;

  for (const row of json.rows ?? []) {
    const dims = row.dimensionValues?.map((item) => item.value ?? '') ?? [];
    const mets = row.metricValues?.map((item) => Number(item.value ?? 0)) ?? [];
    const [dateRaw, pageRaw, sourceRaw, mediumRaw] = dims;
    const date = new Date(`${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}T00:00:00.000Z`);
    const landingPage = (pageRaw || '/').split(/[?#]/)[0] || '/';
    const source = sourceRaw || 'unknown';
    const medium = mediumRaw || 'unknown';
    await prisma.ga4LandingPageDaily.upsert({
      where: { date_landingPage_source_medium: { date, landingPage, source, medium } },
      create: { date, landingPage, source, medium, trafficChannel: channel(source, medium), industry: industryFor(landingPage), sessions: Math.trunc(mets[0] ?? 0), engagedSessions: Math.trunc(mets[1] ?? 0), users: Math.trunc(mets[2] ?? 0), conversions: Math.trunc(mets[3] ?? 0) },
      update: { trafficChannel: channel(source, medium), industry: industryFor(landingPage), sessions: Math.trunc(mets[0] ?? 0), engagedSessions: Math.trunc(mets[1] ?? 0), users: Math.trunc(mets[2] ?? 0), conversions: Math.trunc(mets[3] ?? 0) },
    });
    imported += 1;
  }
  await mark(provider, { lastSuccessfulAt: new Date(), lastError: null, rowsImported: { increment: imported } });
  return imported;
}

const daysArg = process.argv.find((arg) => arg.startsWith('--days='));
const days = daysArg ? Number(daysArg.split('=')[1]) : 30;

try {
  const token = await accessToken();
  const searchRows = await syncSearchConsole(days, token);
  const ga4Rows = await syncGa4(days, token);
  console.log(JSON.stringify({ ok: true, searchConsoleRows: searchRows, ga4Rows }, null, 2));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
