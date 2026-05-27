'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CredentialProvider } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { deleteCredential, upsertCredential } from '@/lib/server/credentials';
import { runGa4Sync, runSearchConsoleSync } from '@/lib/server/seo-sync';

const providerSchema = z.nativeEnum(CredentialProvider);
const credentialKeySchema = z.string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_.-]+$/);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function saveCredentialAction(formData: FormData) {
  await requireAdmin('ADMIN');

  const provider = providerSchema.parse(text(formData, 'provider'));
  const key = credentialKeySchema.parse(text(formData, 'key'));
  const value = z.string().min(1).parse(text(formData, 'value'));

  await upsertCredential({
    provider,
    key,
    value,
    status: 'UNKNOWN',
  });

  revalidatePath('/admin/settings');
  redirect('/admin/settings?integration=credential_saved');
}

export async function deleteCredentialAction(formData: FormData) {
  await requireAdmin('ADMIN');

  const id = z.string().min(5).parse(text(formData, 'id'));
  await deleteCredential(id);

  revalidatePath('/admin/settings');
  redirect('/admin/settings?integration=credential_deleted');
}

export async function syncSearchConsoleAction() {
  await requireAdmin('ADMIN');

  let target = '/admin/settings?integration=search_console_synced';
  try {
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
