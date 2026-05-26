import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStat } from '@/components/admin/AdminStat';
import { getAdminDashboardData } from '@/lib/server/admin-dashboard';

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <>
      <AdminPageHeader
        title="Growth Dashboard"
        description="A single operating view for qualified leads, first-party conversion events, and content assets that support AI/search discovery."
        action={
          <Link href="/admin/leads" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">
            Review leads
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Total leads" value={data.leads.total} detail="All captured inquiries" />
        <AdminStat label="New leads" value={data.leads.new} detail="Needs first response" />
        <AdminStat label="Qualified" value={data.leads.qualified} detail="Sales-ready pipeline" />
        <AdminStat label="Won" value={data.leads.won} detail="Closed from website" />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminStat label="Visits" value={data.traffic.visits} detail="Local 30-day rollup" />
        <AdminStat label="CTA clicks" value={data.traffic.ctaClicks} />
        <AdminStat label="Form starts" value={data.traffic.formStarts} />
        <AdminStat label="Form submits" value={data.traffic.formSubmits} />
        <AdminStat label="WhatsApp clicks" value={data.traffic.whatsappClicks} />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">Recent leads</h2>
          </div>
          <div className="divide-y divide-white/10">
            {data.leads.recent.length === 0 ? (
              <p className="px-5 py-8 text-sm text-white/40">No leads captured yet.</p>
            ) : (
              data.leads.recent.map((lead) => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="grid gap-2 px-5 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium text-white">{lead.name}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {lead.company || 'No company'} · {lead.serviceInterest}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/50">{lead.status}</span>
                    <span className="rounded-full bg-teal/10 px-2 py-1 text-[10px] text-teal">Score {lead.score}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold text-white">CMS inventory</h2>
          <div className="mt-5 space-y-3">
            {[
              ['Services', data.content.services, '/admin/content/services'],
              ['Case studies', data.content.caseStudies, '/admin/content/case-studies'],
              ['Insights', data.content.insights, '/admin/content/insights'],
              ['Testimonials', data.content.testimonials, '/admin/content/testimonials'],
              ['FAQs', data.content.faqs, '/admin/content/faqs'],
            ].map(([label, value, href]) => (
              <Link key={label} href={String(href)} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 hover:bg-white/[0.03] hover:text-white">
                <span>{label}</span>
                <span>{value}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
