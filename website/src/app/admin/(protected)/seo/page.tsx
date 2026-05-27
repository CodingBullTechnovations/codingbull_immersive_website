import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminDashboardData } from '@/lib/server/admin-dashboard';

function n(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function pct(value: number) {
  return `${value.toFixed(2)}%`;
}

export default async function SeoHealthPage() {
  const data = await getAdminDashboardData();

  return (
    <>
      <AdminPageHeader
        title="SEO Health"
        description="Industry clusters, query performance, landing-page opportunities, seed status, and integration health."
        action={<Link href="/admin/settings" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">Integrations</Link>}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.industryPerformance.map((industry) => (
          <div key={industry.industry} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">{industry.label}</p>
            <p className="mt-4 text-3xl font-bold text-white">{n(industry.impressions)}</p>
            <p className="mt-2 text-xs text-white/40">{n(industry.organicClicks)} clicks · {pct(industry.ctr)} CTR · position {industry.averagePosition || '-'}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="Landing pages">
          <SeoRows rows={data.seo.topPages} empty="No Search Console landing-page rows imported yet." />
        </Panel>
        <Panel title="Queries">
          <SeoRows rows={data.seo.topQueries} empty="No Search Console query rows imported yet." queryMode />
        </Panel>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Backend seed health">
          <div className="space-y-3 text-sm text-white/55">
            <Row label="Services" value={`${data.content.seedStatus.actual.services}/${data.content.seedStatus.expected.services}`} />
            <Row label="Case studies" value={`${data.content.seedStatus.actual.caseStudies}/${data.content.seedStatus.expected.caseStudies}`} />
            <Row label="Insights" value={`${data.content.seedStatus.actual.insights}/${data.content.seedStatus.expected.insights}`} />
          </div>
          {(data.content.seedStatus.missing.services.length > 0 || data.content.seedStatus.missing.caseStudies.length > 0 || data.content.seedStatus.missing.insights.length > 0) && (
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-100">
              Missing backend content exists. Run `npm run db:seed:content`.
            </p>
          )}
        </Panel>

        <Panel title="Generated action queue">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {data.actionQueue.map((action) => (
              <div key={action.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">{action.priority}</span>
                <h3 className="mt-3 text-sm font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/45">{action.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">{title}</div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function SeoRows({
  rows,
  empty,
  queryMode = false,
}: {
  rows: Array<{ page: string; query?: string; label: string; clicks: number; impressions: number; ctr: number; averagePosition: number }>;
  empty: string;
  queryMode?: boolean;
}) {
  if (rows.length === 0) return <p className="text-sm text-white/40">{empty}</p>;

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={`${row.query ?? row.page}-${row.page}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-medium text-white">{queryMode ? row.query : row.page}</p>
          <p className="mt-1 break-all text-xs text-white/35">{queryMode ? row.page : row.label}</p>
          <p className="mt-3 text-xs text-white/50">{n(row.clicks)} clicks · {n(row.impressions)} impressions · {pct(row.ctr)} CTR · position {row.averagePosition || '-'}</p>
        </div>
      ))}
    </div>
  );
}
