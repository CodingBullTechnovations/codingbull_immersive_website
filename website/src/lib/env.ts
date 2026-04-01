// =============================================================================
// Typed environment variable access
// =============================================================================

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// --- Public (available in client and server) ---
export const env = {
  /** Google Analytics 4 Measurement ID */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',

  /** Site base URL (no trailing slash) */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.codingbullz.com',

  /** WhatsApp number with country code, no spaces */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210',

  /** Whether we're in production */
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// --- Server-only (never exposed to client bundle) ---
export function getServerEnv() {
  return {
    /** Email service API key (e.g. Resend) */
    emailApiKey: getEnvVar('EMAIL_API_KEY', ''),

    /** Email address to receive form submissions */
    contactEmail: getEnvVar('CONTACT_EMAIL', 'hello@codingbullz.com'),

    /** Email from address */
    emailFrom: getEnvVar('EMAIL_FROM', 'noreply@codingbullz.com'),
  };
}
