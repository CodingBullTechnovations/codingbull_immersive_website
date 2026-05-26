export function getEmailConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    contactEmail: process.env.CONTACT_EMAIL ?? 'codingbullz@gmail.com',
    emailFrom: process.env.EMAIL_FROM ?? 'CodingBull <hello@codingbullz.com>',
    smtpHost: process.env.SMTP_HOST ?? '',
    smtpPort: Number(process.env.SMTP_PORT ?? 587),
    smtpUser: process.env.SMTP_USER ?? '',
    smtpPassword: process.env.SMTP_PASSWORD ?? '',
    smtpFrom: process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? 'CodingBull <hello@codingbullz.com>',
  };
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.codingbullz.com';
}
