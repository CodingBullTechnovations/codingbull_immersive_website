'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';
import { writeAuditLog } from '@/lib/server/audit';

export async function saveMediaAssetAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const url = z.string().url().parse(String(formData.get('url') ?? '').trim());
  const fileName = z.string().min(2).parse(String(formData.get('fileName') ?? '').trim());
  const altText = z.string().min(5).parse(String(formData.get('altText') ?? '').trim());
  const mimeType = String(formData.get('mimeType') ?? 'image/png').trim();
  const usage = String(formData.get('usage') ?? '').trim() || null;

  const media = await prisma.mediaAsset.create({
    data: {
      url,
      fileName,
      altText,
      mimeType,
      usage,
      uploadedById: session.user.id,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'media.create',
    entityType: 'MediaAsset',
    entityId: media.id,
    afterSummary: { url, altText },
  });

  revalidatePath('/admin/media');
}
