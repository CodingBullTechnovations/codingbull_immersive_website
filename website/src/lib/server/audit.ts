import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';

interface AuditLogInput {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeSummary?: Prisma.InputJsonValue;
  afterSummary?: Prisma.InputJsonValue;
  ipHash?: string | null;
  userAgentHash?: string | null;
}

export async function writeAuditLog(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        beforeSummary: input.beforeSummary,
        afterSummary: input.afterSummary,
        ipHash: input.ipHash ?? null,
        userAgentHash: input.userAgentHash ?? null,
      },
    });
  } catch (error) {
    console.error('[audit_log_failed]', error);
  }
}
