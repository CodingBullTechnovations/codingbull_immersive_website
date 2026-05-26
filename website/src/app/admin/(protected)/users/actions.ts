'use server';

import { revalidatePath } from 'next/cache';
import { UserRole, UserStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';
import { writeAuditLog } from '@/lib/server/audit';

export async function createAdminUserAction(formData: FormData) {
  const session = await requireAdmin('OWNER');
  const email = z.string().email().parse(String(formData.get('email') ?? '').trim().toLowerCase());
  const name = String(formData.get('name') ?? '').trim() || null;
  const password = z.string().min(12).parse(String(formData.get('password') ?? ''));
  const role = z.nativeEnum(UserRole).parse(String(formData.get('role') ?? UserRole.VIEWER));
  const status = z.nativeEnum(UserStatus).parse(String(formData.get('status') ?? UserStatus.ACTIVE));

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash: await hash(password, 12),
      role,
      status,
    },
    create: {
      email,
      name,
      passwordHash: await hash(password, 12),
      role,
      status,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'user.upsert',
    entityType: 'User',
    entityId: user.id,
    afterSummary: { email, role, status },
  });

  revalidatePath('/admin/users');
}
