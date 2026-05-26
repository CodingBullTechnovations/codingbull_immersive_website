import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/server/authz';

export const metadata: Metadata = {
  title: 'CodingBull Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return <AdminShell session={session}>{children}</AdminShell>;
}
