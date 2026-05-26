import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listServicePages } from '@/lib/server/cms';

export default async function AdminServicesPage() {
  const services = await listServicePages();

  return (
    <>
      <AdminPageHeader
        title="Service Pages"
        description="Manage the four commercial niche hubs and their SEO, direct-answer, module, and FAQ content."
        action={<Link href="/admin/content/services/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">New service</Link>}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {services.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No database-backed service pages yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {services.map((service) => (
              <Link key={service.id} href={`/admin/content/services/${service.id}`} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-white">{service.title}</p>
                  <p className="mt-1 text-xs text-white/40">/services/{service.slug}</p>
                </div>
                <span className="text-xs text-white/45">{service.niche}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{service.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
