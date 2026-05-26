import { UserRole, UserStatus } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listUsersAdmin } from '@/lib/server/cms';
import { createAdminUserAction } from './actions';

export default async function AdminUsersPage() {
  const users = await listUsersAdmin();

  return (
    <>
      <AdminPageHeader title="Users" description="Owner-only admin user management. Use strong temporary passwords and rotate them after first login." />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={createAdminUserAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <AdminField label="Name">
            <input name="name" className={adminInputClass} />
          </AdminField>
          <AdminField label="Email">
            <input name="email" type="email" required className={adminInputClass} />
          </AdminField>
          <AdminField label="Temporary password" hint="Minimum 12 characters. Share outside the website.">
            <input name="password" type="password" required minLength={12} className={adminInputClass} />
          </AdminField>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <AdminField label="Role">
              <select name="role" defaultValue={UserRole.EDITOR} className={adminSelectClass}>
                {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </AdminField>
            <AdminField label="Status">
              <select name="status" defaultValue={UserStatus.ACTIVE} className={adminSelectClass}>
                {Object.values(UserStatus).map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </AdminField>
          </div>
          <AdminSubmitButton label="Save user" />
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          {users.length === 0 ? (
            <p className="px-5 py-10 text-sm text-white/45">No admin users found.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {users.map((user) => (
                <div key={user.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                  <div>
                    <p className="font-semibold text-white">{user.name || user.email}</p>
                    <p className="mt-1 text-xs text-white/40">{user.email}</p>
                  </div>
                  <span className="text-xs text-white/45">{user.role}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{user.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
