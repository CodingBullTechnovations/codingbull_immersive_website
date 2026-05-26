import { AdminField, adminInputClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listSettingsAdmin } from '@/lib/server/cms';
import { saveSettingAction } from '../content/actions';

export default async function AdminSettingsPage() {
  const settings = await listSettingsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Manage structured company facts, CTA defaults, crawler policy, and operational configuration stored in the database."
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={saveSettingAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <AdminField label="Key">
            <input name="key" required placeholder="company.phone" className={adminInputClass} />
          </AdminField>
          <AdminField label="JSON value">
            <textarea name="value" required rows={8} placeholder={'"value" or {"enabled": true}'} className={`${adminInputClass} font-mono text-xs`} />
          </AdminField>
          <AdminField label="Description">
            <textarea name="description" rows={3} className={adminInputClass} />
          </AdminField>
          <AdminSubmitButton label="Save setting" />
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          {settings.length === 0 ? (
            <p className="px-5 py-10 text-sm text-white/45">No settings saved yet.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {settings.map((setting) => (
                <div key={setting.id} className="px-5 py-4">
                  <p className="font-semibold text-white">{setting.key}</p>
                  {setting.description && <p className="mt-1 text-xs text-white/40">{setting.description}</p>}
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-black/20 p-3 text-xs text-white/50">
                    {JSON.stringify(setting.value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
