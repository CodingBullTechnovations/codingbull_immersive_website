import { prisma } from '@/lib/server/prisma';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStat } from '@/components/admin/AdminStat';

export default async function AdminAnalyticsPage() {
  const [metrics, topPages] = await Promise.all([
    prisma.pageMetricDaily.findMany({ orderBy: { date: 'desc' }, take: 30 }),
    prisma.analyticsEvent.groupBy({
      by: ['page'],
      _count: { _all: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    }),
  ]);

  const totals = metrics.reduce(
    (acc, metric) => ({
      visits: acc.visits + metric.visits,
      ctaClicks: acc.ctaClicks + metric.ctaClicks,
      formStarts: acc.formStarts + metric.formStarts,
      formSubmits: acc.formSubmits + metric.formSubmits,
      whatsappClicks: acc.whatsappClicks + metric.whatsappClicks,
    }),
    { visits: 0, ctaClicks: 0, formStarts: 0, formSubmits: 0, whatsappClicks: 0 },
  );

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="First-party, no-PII conversion event rollups. Use GA4 and Search Console separately for external search query data."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminStat label="Visits" value={totals.visits} />
        <AdminStat label="CTA clicks" value={totals.ctaClicks} />
        <AdminStat label="Form starts" value={totals.formStarts} />
        <AdminStat label="Form submits" value={totals.formSubmits} />
        <AdminStat label="WhatsApp clicks" value={totals.whatsappClicks} />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">Daily metrics</div>
          <div className="divide-y divide-white/10">
            {metrics.map((metric) => (
              <div key={metric.id} className="grid grid-cols-2 gap-3 px-5 py-4 text-sm text-white/55 md:grid-cols-6">
                <span>{metric.date.toISOString().slice(0, 10)}</span>
                <span>Visits {metric.visits}</span>
                <span>CTA {metric.ctaClicks}</span>
                <span>Starts {metric.formStarts}</span>
                <span>Submits {metric.formSubmits}</span>
                <span>WA {metric.whatsappClicks}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">Top event pages</div>
          <div className="divide-y divide-white/10">
            {topPages.map((page) => (
              <div key={page.page} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <span className="break-all text-white/60">{page.page}</span>
                <span className="text-teal">{page._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
