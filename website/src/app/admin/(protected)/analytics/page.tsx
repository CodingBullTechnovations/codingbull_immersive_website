import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStat } from '@/components/admin/AdminStat';
import { getAdminDashboardData } from '@/lib/server/admin-dashboard';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default async function AdminAnalyticsPage() {
  const data = await getAdminDashboardData();

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="First-party visitor analytics, Search Console performance, GA4 landing-page imports, and industry attribution."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminStat label="Visits" value={formatNumber(data.traffic.visits)} detail="First-party page views" />
        <AdminStat label="Visitors" value={formatNumber(data.traffic.visitors)} detail="Hashed visitor IDs" />
        <AdminStat label="CTA clicks" value={formatNumber(data.traffic.ctaClicks)} />
        <AdminStat label="Form submits" value={formatNumber(data.traffic.formSubmits)} />
        <AdminStat label="WhatsApp clicks" value={formatNumber(data.traffic.whatsappClicks)} />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Organic clicks" value={formatNumber(data.seo.organicClicks)} />
        <AdminStat label="Impressions" value={formatNumber(data.seo.impressions)} />
        <AdminStat label="CTR" value={formatPercent(data.seo.ctr)} />
        <AdminStat label="Avg. position" value={data.seo.averagePosition || '-'} />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">Industry performance</div>
          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                <tr>
                  {['Industry', 'Visits', 'Clicks', 'Impressions', 'CTR', 'Position', 'Submits', 'Leads'].map((header) => (
                    <th key={header} className="px-3 py-2 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.industryPerformance.map((industry) => (
                  <tr key={industry.industry} className="text-white/60">
                    <td className="px-3 py-3 font-medium text-white">{industry.label}</td>
                    <td className="px-3 py-3">{formatNumber(industry.visits)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.organicClicks)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.impressions)}</td>
                    <td className="px-3 py-3">{formatPercent(industry.ctr)}</td>
                    <td className="px-3 py-3">{industry.averagePosition || '-'}</td>
                    <td className="px-3 py-3">{formatNumber(industry.formSubmits)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.leads)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">Sync status</div>
          <div className="space-y-3 p-5">
            {data.seo.syncStatus.length === 0 ? (
              <p className="text-sm text-white/40">No Search Console or GA4 import sync has run yet.</p>
            ) : (
              data.seo.syncStatus.map((sync) => (
                <div key={sync.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">{sync.provider}</p>
                    <span className="text-xs text-teal">{formatNumber(sync.rowsImported)} rows</span>
                  </div>
                  <p className="mt-2 text-xs text-white/40">
                    Last success: {sync.lastSuccessfulAt ? sync.lastSuccessfulAt.toISOString().slice(0, 10) : 'Never'}
                  </p>
                  {sync.lastError && <p className="mt-2 text-xs text-amber-200">{sync.lastError}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SeoTable title="Top SEO pages" rows={data.seo.topPages} empty="No Search Console page rows imported yet." />
        <SeoTable title="Top SEO queries" rows={data.seo.topQueries} empty="No Search Console query rows imported yet." queryMode />
      </section>
    </>
  );
}

function SeoTable({
  title,
  rows,
  empty,
  queryMode = false,
}: {
  title: string;
  rows: Array<{ page: string; query?: string; label: string; clicks: number; impressions: number; ctr: number; averagePosition: number }>;
  empty: string;
  queryMode?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">{title}</div>
      <div className="divide-y divide-white/10">
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-white/40">{empty}</p>
        ) : (
          rows.map((row) => (
            <div key={`${row.query ?? row.page}-${row.page}`} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{queryMode ? row.query : row.page}</p>
                  <p className="mt-1 break-all text-xs text-white/35">{queryMode ? row.page : row.label}</p>
                </div>
                <span className="shrink-0 rounded-full bg-teal/10 px-2 py-1 text-[10px] text-teal">{row.label}</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3 text-xs text-white/50">
                <span>Clicks {formatNumber(row.clicks)}</span>
                <span>Impr. {formatNumber(row.impressions)}</span>
                <span>CTR {formatPercent(row.ctr)}</span>
                <span>Pos. {row.averagePosition || '-'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
