import { getBaseUrl } from '@/lib/server/env';

const productionBaseUrl = 'https://www.codingbullz.com';

export const googleOAuthCallbackPath = '/api/admin/integrations/google/callback';
export const googleOAuthStartPath = '/api/admin/integrations/google/start';
export const googleOAuthAdminSettingsPath = '/admin/settings';
export const googleOAuthAdminLoginPath = '/admin/login';

function normalizedBaseUrl() {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  if (process.env.NODE_ENV === 'production' || baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    return productionBaseUrl;
  }
  return baseUrl;
}

function requestOrigin(requestUrl?: string) {
  return requestUrl ? new URL(requestUrl).origin : normalizedBaseUrl();
}

export function getGoogleOAuthRedirectUri(requestUrl?: string) {
  if (process.env.NODE_ENV === 'production') {
    return `${normalizedBaseUrl()}${googleOAuthCallbackPath}`;
  }
  return `${requestOrigin(requestUrl)}${googleOAuthCallbackPath}`;
}

export function getGoogleOAuthStartUrl(requestUrl?: string) {
  if (process.env.NODE_ENV === 'production') {
    return `${normalizedBaseUrl()}${googleOAuthStartPath}`;
  }
  return `${requestOrigin(requestUrl)}${googleOAuthStartPath}`;
}

export function getProductionGoogleOAuthRedirectUri() {
  return `${productionBaseUrl}${googleOAuthCallbackPath}`;
}

export function getLocalGoogleOAuthRedirectUri() {
  return `http://localhost:3000${googleOAuthCallbackPath}`;
}

export function getGoogleOAuthAdminSettingsUrl(requestUrl?: string, search = '') {
  const baseUrl = process.env.NODE_ENV === 'production' ? normalizedBaseUrl() : requestOrigin(requestUrl);
  return `${baseUrl}${googleOAuthAdminSettingsPath}${search}`;
}

export function getGoogleOAuthAdminLoginUrl(requestUrl?: string) {
  const baseUrl = process.env.NODE_ENV === 'production' ? normalizedBaseUrl() : requestOrigin(requestUrl);
  const url = new URL(googleOAuthAdminLoginPath, baseUrl);
  url.searchParams.set('callbackUrl', googleOAuthAdminSettingsPath);
  return url.toString();
}

export function getGoogleOAuthBaseUrl() {
  return normalizedBaseUrl();
}
