import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { CredentialProvider, CredentialStatus } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';

const algorithm = 'aes-256-gcm';

function getSecretKey() {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('Set CREDENTIAL_ENCRYPTION_KEY or AUTH_SECRET before saving credentials.');
  }

  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, getSecretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptSecret(value: string) {
  const [ivRaw, tagRaw, encryptedRaw] = value.split('.');
  if (!ivRaw || !tagRaw || !encryptedRaw) throw new Error('Invalid encrypted credential payload.');

  const decipher = createDecipheriv(algorithm, getSecretKey(), Buffer.from(ivRaw, 'base64'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

export function maskSecret(value: string) {
  if (!value) return '';
  if (value.length <= 8) return '••••';
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function upsertCredential(input: {
  provider: CredentialProvider;
  key: string;
  value: string;
  status?: CredentialStatus;
  lastError?: string | null;
}) {
  return prisma.integrationCredential.upsert({
    where: {
      provider_key: {
        provider: input.provider,
        key: input.key,
      },
    },
    update: {
      encryptedValue: encryptSecret(input.value),
      maskedValue: maskSecret(input.value),
      status: input.status ?? 'UNKNOWN',
      lastError: input.lastError ?? null,
      lastVerifiedAt: input.status === 'VERIFIED' ? new Date() : undefined,
    },
    create: {
      provider: input.provider,
      key: input.key,
      encryptedValue: encryptSecret(input.value),
      maskedValue: maskSecret(input.value),
      status: input.status ?? 'UNKNOWN',
      lastError: input.lastError ?? null,
      lastVerifiedAt: input.status === 'VERIFIED' ? new Date() : null,
    },
  });
}

export async function getCredential(provider: CredentialProvider, key: string) {
  const credential = await prisma.integrationCredential.findUnique({
    where: {
      provider_key: {
        provider,
        key,
      },
    },
  });

  return credential ? decryptSecret(credential.encryptedValue) : '';
}

export async function listCredentialSummaries() {
  return prisma.integrationCredential.findMany({
    orderBy: [{ provider: 'asc' }, { key: 'asc' }],
    select: {
      id: true,
      provider: true,
      key: true,
      maskedValue: true,
      status: true,
      lastVerifiedAt: true,
      lastError: true,
      updatedAt: true,
    },
  });
}

export async function deleteCredential(id: string) {
  return prisma.integrationCredential.delete({ where: { id } });
}

export async function getIntegrationValue(provider: CredentialProvider, key: string, envKey?: string) {
  const fromDb = await getCredential(provider, key).catch(() => '');
  return fromDb || (envKey ? process.env[envKey] ?? '' : '');
}
