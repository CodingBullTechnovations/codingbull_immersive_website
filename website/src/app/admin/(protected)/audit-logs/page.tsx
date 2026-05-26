import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listAuditLogsAdmin } from '@/lib/server/cms';

export default async function AdminAuditLogsPage() {
  const logs = await listAuditLogsAdmin();

  return (
    <>
      <AdminPageHeader title="Audit Logs" description="Recent admin mutations, actor information, and compact before/after summaries." />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {logs.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No audit events yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="font-semibold text-white">{log.action}</p>
                  <p className="text-xs text-white/35">{log.createdAt.toLocaleString('en-IN')}</p>
                </div>
                <p className="mt-1 text-xs text-white/45">
                  {log.entityType}{log.entityId ? `:${log.entityId}` : ''} · {log.actor?.name || log.actor?.email || 'System'}
                </p>
                {(log.beforeSummary || log.afterSummary) && (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-black/20 p-3 text-xs text-white/45">
                    {JSON.stringify({ before: log.beforeSummary, after: log.afterSummary }, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
