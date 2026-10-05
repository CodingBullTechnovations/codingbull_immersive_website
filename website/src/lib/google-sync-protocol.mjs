// Shared by Admin imports and the scheduled CLI. No database or credentials here.
const missingSearchConsoleSiteReason = 'Missing Search Console site URL';
const invalidSearchConsoleSiteReason = 'Search Console site URL must be sc-domain:codingbullz.com or https://www.codingbullz.com/';
const missingGa4PropertyReason = 'Missing GA4 numeric property ID';
const invalidGa4PropertyReason = 'GA4 property ID must be numeric, not G-...';

/** @param {string} value
 * @returns {{ok: true, value: string} | {ok: false, reason: string}} */
export function normalizeSearchConsoleSiteUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, reason: missingSearchConsoleSiteReason };

  if (trimmed.toLowerCase() === 'sc-domain:codingbullz.com') {
    return { ok: true, value: 'sc-domain:codingbullz.com' };
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === 'https:' && url.hostname === 'www.codingbullz.com' && (url.pathname === '/' || url.pathname === '') && !url.search && !url.hash) {
      return { ok: true, value: 'https://www.codingbullz.com/' };
    }
  } catch {
    return { ok: false, reason: invalidSearchConsoleSiteReason };
  }

  return { ok: false, reason: invalidSearchConsoleSiteReason };
}

/** @param {string} value
 * @returns {{ok: true, value: string} | {ok: false, reason: string}} */
export function normalizeGa4PropertyId(value) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, reason: missingGa4PropertyReason };

  const normalized = trimmed.startsWith('properties/') ? trimmed.slice('properties/'.length) : trimmed;
  if (/^G-/i.test(normalized)) return { ok: false, reason: invalidGa4PropertyReason };
  if (!/^\d+$/.test(normalized)) return { ok: false, reason: invalidGa4PropertyReason };

  return { ok: true, value: normalized };
}

// Keep authentication failures distinguishable from property/report failures.
// Never include request headers, tokens, or request bodies in stored diagnostics.
/** @param {string} stage @param {string} url @param {RequestInit} options */
export async function requestGoogleJson(stage, url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(`${stage}: network request failed. Retry and check server connectivity.`);
  }
  const json = await response.json().catch(() => {
    throw new Error(`${stage}: HTTP ${response.status}; Google returned an unreadable response.`);
  });
  if (!json || typeof json !== 'object') {
    throw new Error(`${stage}: HTTP ${response.status}; Google returned an invalid response.`);
  }
  if (!response.ok) {
    const reason = json.error_description || json.error?.message || (typeof json.error === 'string' ? json.error : 'Request rejected');
    throw new Error(`${stage}: HTTP ${response.status}; ${reason}`);
  }
  return json;
}

