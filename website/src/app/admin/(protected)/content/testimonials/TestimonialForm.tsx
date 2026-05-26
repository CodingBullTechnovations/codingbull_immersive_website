import { ContentStatus, PermissionStatus, ServiceInterest, type Testimonial } from '@prisma/client';
import { AdminField, adminInputClass, adminSelectClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { saveTestimonialAction } from '../actions';

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial | null }) {
  return (
    <form action={saveTestimonialAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AdminField label="Person">
          <input name="person" required defaultValue={testimonial?.person ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Role">
          <input name="role" defaultValue={testimonial?.role ?? ''} className={adminInputClass} />
        </AdminField>
        <AdminField label="Company">
          <input name="company" required defaultValue={testimonial?.company ?? ''} className={adminInputClass} />
        </AdminField>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <AdminField label="Niche">
          <select name="niche" defaultValue={testimonial?.niche ?? ''} className={adminSelectClass}>
            <option value="">General</option>
            {Object.values(ServiceInterest).map((niche) => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Status">
          <select name="status" defaultValue={testimonial?.status ?? ContentStatus.DRAFT} className={adminSelectClass}>
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Permission">
          <select name="permissionStatus" defaultValue={testimonial?.permissionStatus ?? PermissionStatus.UNKNOWN} className={adminSelectClass}>
            {Object.values(PermissionStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Order">
          <input name="order" type="number" defaultValue={testimonial?.order ?? 0} className={adminInputClass} />
        </AdminField>
      </div>

      <AdminField label="Quote">
        <textarea name="quote" required rows={6} defaultValue={testimonial?.quote ?? ''} className={adminInputClass} />
      </AdminField>

      <AdminSubmitButton />
    </form>
  );
}
