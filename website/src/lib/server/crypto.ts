import { createHash } from 'node:crypto';

export function hashValue(value?: string | null) {
  if (!value) return null;

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'local-development';
  return createHash('sha256').update(`${secret}:${value}`).digest('hex');
}

export function getClientIp(headersList: Headers) {
  return (
    headersList.get('cf-connecting-ip') ||
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null
  );
}
