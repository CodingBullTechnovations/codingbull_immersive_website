'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CredentialProvider } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { writeAuditLog } from '@/lib/server/audit';
import { deleteCredential, upsertCredential } from '@/lib/server/credentials';
import { getGoogleSyncReadiness, normalizeGa4PropertyId, normalizeSearchConsoleSiteUrl } from '@/lib/server/google-sync-readiness';
import { runGa4Sync, runSearchConsoleSync } from '@/lib/server/seo-sync';

const providerSchema = z.nativeEnum(CredentialProvider);
const credentialKeySchema = z.string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_.-]+$/);
const ga4MeasurementIdSchema = z.string().trim().transform((value) => value.toUpperCase()).pipe(z.string().regex(/^G-[A-Z0-9]+$/));

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
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
