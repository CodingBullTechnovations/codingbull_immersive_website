import { ContentStatus, ServiceInterest, type FAQ } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { saveFaqAction } from '../actions';

export function FaqForm({ faq }: { faq?: FAQ | null }) {
  return (
    <form action={saveFaqAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <AdminField label="Niche">
          <select name="niche" defaultValue={faq?.niche ?? ''} className={adminSelectClass}>
            <option value="">General</option>
            {Object.values(ServiceInterest).map((niche) => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Page slug">
          <input name="pageSlug" defaultValue={faq?.pageSlug ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Status">
          <select name="status" defaultValue={faq?.status ?? ContentStatus.DRAFT} className={adminSelectClass}>
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Order">
          <input name="order" type="number" defaultValue={faq?.order ?? 0} className={adminInputClass} />
        </AdminField>
      </div>

      <AdminField label="Question">
        <input name="question" required defaultValue={faq?.question ?? ''} className={adminInputClass} />
      </AdminField>
      <AdminField label="Answer">
        <textarea name="answer" required rows={8} defaultValue={faq?.answer ?? ''} className={adminInputClass} />
      </AdminField>

      <AdminSubmitButton />
    </form>
  );
}
