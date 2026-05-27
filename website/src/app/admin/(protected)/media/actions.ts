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

export async function deleteMediaAssetAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  const id = z.string().min(5).parse(String(formData.get('id') ?? '').trim());
  const confirmation = String(formData.get('confirmation') ?? '').trim();

  if (confirmation !== 'DELETE') {
    throw new Error('Type DELETE to remove this media record.');
  }

  const media = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!media) return;

  await prisma.mediaAsset.delete({ where: { id } });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'media.delete',
    entityType: 'MediaAsset',
    entityId: id,
    beforeSummary: { fileName: media.fileName, url: media.url },
    afterSummary: { deleted: true },
  });

  revalidatePath('/admin/media');
}
