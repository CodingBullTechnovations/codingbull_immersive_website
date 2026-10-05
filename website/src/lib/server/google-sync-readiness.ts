import { normalizeGa4PropertyId, normalizeSearchConsoleSiteUrl } from '@/lib/google-sync-protocol.mjs';
export { normalizeGa4PropertyId, normalizeSearchConsoleSiteUrl } from '@/lib/google-sync-protocol.mjs';
import { getIntegrationValue } from '@/lib/server/credentials';

export type SyncReadinessItem = {
  ready: boolean;
  reason: string;
};

const readyReason = 'Ready';
const missingGoogleClientReason = 'Google API client credentials missing';
const missingRefreshTokenReason = 'Missing OAuth refresh token';
const missingGa4MeasurementReason = 'Missing GA4 measurement ID';

function readyOrReason(ready: boolean, reason: string): SyncReadinessItem {
  return {
    ready,
    reason: ready ? readyReason : reason,
  };
}

export async function getGoogleSyncReadiness() {
  const [clientId, clientSecret, refreshToken, searchConsoleSiteUrl, ga4PropertyId, ga4MeasurementCredential] = await Promise.all([
    getIntegrationValue('GOOGLE', 'client_id', 'GOOGLE_CLIENT_ID'),
    getIntegrationValue('GOOGLE', 'client_secret', 'GOOGLE_CLIENT_SECRET'),
    getIntegrationValue('GOOGLE', 'refresh_token', 'GOOGLE_REFRESH_TOKEN'),
    getIntegrationValue('SEARCH_CONSOLE', 'site_url', 'GOOGLE_SEARCH_CONSOLE_SITE_URL'),
    getIntegrationValue('GA4', 'property_id', 'GA4_PROPERTY_ID'),
    getIntegrationValue('GA4', 'measurement_id', 'GA4_MEASUREMENT_ID'),
  ]);
  const ga4MeasurementId = ga4MeasurementCredential || process.env.NEXT_PUBLIC_GA_ID || '';

  const hasGoogleClient = Boolean(clientId && clientSecret);
  const hasRefreshToken = Boolean(refreshToken);
  const searchConsoleSite = normalizeSearchConsoleSiteUrl(searchConsoleSiteUrl);
  const ga4Property = normalizeGa4PropertyId(ga4PropertyId);

  const oauth = !hasGoogleClient
    ? readyOrReason(false, missingGoogleClientReason)
    : readyOrReason(hasRefreshToken, missingRefreshTokenReason);

  const searchConsole = !hasGoogleClient
    ? readyOrReason(false, missingGoogleClientReason)
    : !hasRefreshToken
      ? readyOrReason(false, missingRefreshTokenReason)
      : searchConsoleSite.ok
        ? readyOrReason(true, readyReason)
        : readyOrReason(false, searchConsoleSite.reason);

  const ga4 = !hasGoogleClient
    ? readyOrReason(false, missingGoogleClientReason)
    : !hasRefreshToken
      ? readyOrReason(false, missingRefreshTokenReason)
      : ga4Property.ok
        ? readyOrReason(true, readyReason)
        : readyOrReason(false, ga4Property.reason);

  return {
    oauth,
    searchConsole,
    ga4,
    ga4Measurement: readyOrReason(Boolean(ga4MeasurementId), missingGa4MeasurementReason),
  };
}
