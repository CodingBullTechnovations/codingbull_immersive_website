'use server';

import { revalidatePath } from 'next/cache';
import { LeadActivityType, LeadStatus } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';
import { writeAuditLog } from '@/lib/server/audit';

const leadStatusSchema = z.nativeEnum(LeadStatus);

export async function updateLeadStatusAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const leadId = String(formData.get('leadId') ?? '');
  const status = leadStatusSchema.parse(String(formData.get('status') ?? ''));

  const before = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { status: true },
  });

  const lead = await prisma.$transaction(async (tx) => {
    const updated = await tx.lead.update({
      where: { id: leadId },
      data: { status },
    });

    await tx.leadActivity.create({
      data: {
        leadId,
        type: LeadActivityType.STATUS_CHANGE,
        title: `Status changed to ${status}`,
        detail: `Changed from ${before?.status ?? 'UNKNOWN'} to ${status}.`,
      },
    });

    return updated;
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'lead.status.update',
    entityType: 'Lead',
    entityId: leadId,
    beforeSummary: { status: before?.status },
    afterSummary: { status: lead.status },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadNoteAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const leadId = String(formData.get('leadId') ?? '');
  const body = z.string().min(2).max(2000).parse(String(formData.get('body') ?? ''));

  await prisma.$transaction([
    prisma.leadNote.create({
      data: {
        leadId,
        authorId: session.user.id,
        body,
      },
    }),
    prisma.leadActivity.create({
      data: {
        leadId,
        type: LeadActivityType.NOTE,
        title: 'Internal note added',
        detail: body.slice(0, 180),
      },
    }),
  ]);

  await writeAuditLog({
    actorId: session.user.id,
    action: 'lead.note.create',
    entityType: 'Lead',
    entityId: leadId,
    afterSummary: { preview: body.slice(0, 120) },
  });

  revalidatePath(`/admin/leads/${leadId}`);
}
