import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listTestimonialsAdmin } from '@/lib/server/cms';

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonialsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Manage permission-safe quotes and niche mapping for trust sections."
        action={<Link href="/admin/content/testimonials/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">New testimonial</Link>}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {testimonials.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No testimonials yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {testimonials.map((item) => (
              <Link key={item.id} href={`/admin/content/testimonials/${item.id}`} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-white">{item.person}</p>
                  <p className="mt-1 text-xs text-white/40">{item.company}</p>
                </div>
                <span className="text-xs text-white/45">{item.permissionStatus}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{item.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
