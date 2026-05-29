'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';
import { writeAuditLog } from '@/lib/server/audit';
import {
  SIDEBAR_CONFIG_KEY,
  normalizeSidebarStore,
  sidebarStoreSchema,
  type InsightSidebarStore,
} from '@/lib/sidebar-config';

export async function saveSidebarConfigAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');

  const rawJson = String(formData.get('store') ?? '').trim();
  if (!rawJson) {
    redirect('/admin/settings/sidebar?notice=invalid&reason=Empty+store+payload');
  }

  let parsed: InsightSidebarStore;
  try {
    const normalized = normalizeSidebarStore(JSON.parse(rawJson));
    parsed = sidebarStoreSchema.parse(normalized);
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues.map((i) => i.message).join(', ')
      : 'Invalid JSON';
    redirect(`/admin/settings/sidebar?notice=invalid&reason=${encodeURIComponent(message)}`);
  }

  const saved = await prisma.siteSetting.upsert({
    where: { key: SIDEBAR_CONFIG_KEY },
    update: { value: parsed as unknown as Prisma.InputJsonValue, description: 'Insight sidebar widget configuration (managed via /admin/settings/sidebar)' },
    create: { key: SIDEBAR_CONFIG_KEY, value: parsed as unknown as Prisma.InputJsonValue, description: 'Insight sidebar widget configuration (managed via /admin/settings/sidebar)' },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'setting.sidebar_config',
    entityType: 'SiteSetting',
    entityId: saved.id,
    afterSummary: {
      key: SIDEBAR_CONFIG_KEY,
      defaultMode: parsed.defaultAssignment.mode,
      presetCount: Object.keys(parsed.presets).length,
      overrideCount: Object.keys(parsed.perSlug).length,
      overrideSlugs: Object.keys(parsed.perSlug).slice(0, 20),
    },
  });

  // Revalidate all insight pages so they pick up the new config on next visit
  revalidatePath('/insights');
  revalidatePath('/insights/[slug]', 'page');
  revalidatePath('/admin/settings/sidebar');

  redirect('/admin/settings/sidebar?notice=saved');
}
