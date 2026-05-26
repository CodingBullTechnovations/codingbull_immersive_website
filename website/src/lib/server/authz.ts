import { redirect } from 'next/navigation';
import type { UserRole } from '@prisma/client';
import { auth } from '@/auth';

const roleWeight: Record<UserRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export function hasRole(userRole: UserRole, minimumRole: UserRole) {
  return roleWeight[userRole] >= roleWeight[minimumRole];
}

export async function requireAdmin(minimumRole: UserRole = 'VIEWER') {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  if (!hasRole(session.user.role, minimumRole)) {
    throw new Error('You do not have permission to perform this action.');
  }

  return session;
}
