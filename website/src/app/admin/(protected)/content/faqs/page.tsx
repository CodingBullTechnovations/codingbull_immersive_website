import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listFaqsAdmin } from '@/lib/server/cms';

export default async function AdminFaqsPage() {
  const faqs = await listFaqsAdmin();

  return (
    <>
      <AdminPageHeader
        title="FAQs"
        description="Manage direct-answer content used by service pages, FAQ schema, and buyer objection handling."
        action={<Link href="/admin/content/faqs/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">New FAQ</Link>}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        {faqs.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No FAQs yet.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {faqs.map((faq) => (
              <Link key={faq.id} href={`/admin/content/faqs/${faq.id}`} className="grid gap-3 px-5 py-4 hover:bg-white/[0.03] lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <p className="font-semibold text-white">{faq.question}</p>
                  <p className="mt-1 text-xs text-white/40">{faq.pageSlug || faq.niche || 'General'}</p>
                </div>
                <span className="text-xs text-white/45">Order {faq.order}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">{faq.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
