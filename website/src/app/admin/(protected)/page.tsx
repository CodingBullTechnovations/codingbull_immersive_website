import Link from 'next/link';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Database, Search, TrendingUp } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStat } from '@/components/admin/AdminStat';
import { getAdminDashboardData } from '@/lib/server/admin-dashboard';
import { getContentOwnershipMatrix, getContentOwnershipSummary } from '@/lib/server/content-ownership';
import { testTrackingAction } from './actions';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function StatusBadge({ status }: { status: string }) {
  const isOk = status === 'ok';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
      isOk ? 'border-teal/30 bg-teal/10 text-teal' : 'border-amber-400/25 bg-amber-400/10 text-amber-200'
    }`}>
      {isOk ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {status.replaceAll('_', ' ')}
    </span>
  );
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <h2 className="font-semibold text-white">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const ownershipSummary = getContentOwnershipSummary();
  const ownershipMatrix = getContentOwnershipMatrix();
  const healthCards = [
    { label: 'Database', item: data.health.database, Icon: Database },
    { label: 'First-party tracking', item: data.health.firstPartyAnalytics, Icon: Activity },
    { label: 'Analytics API', item: data.health.analyticsLastError, Icon: AlertTriangle },
    { label: 'GA4', item: data.health.ga4, Icon: TrendingUp },
    { label: 'Search Console', item: data.health.searchConsole, Icon: Search },
  ];

  return (
    <>
      <AdminPageHeader
        title="Growth Intelligence"
        description="Visitors, organic discovery, industry SEO performance, first-party conversion events, and content inventory in one operating view."
        action={
          <div className="flex flex-wrap gap-3">
            <form action={testTrackingAction}>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/[0.04]">
                <Activity className="h-4 w-4" />
                Test tracking
              </button>
            </form>
            <Link href="/admin/analytics" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary-hover">
              <BarChart3 className="h-4 w-4" />
              View analytics
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {healthCards.map(({ label, item, Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <Icon className="h-5 w-5 text-teal" />
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">{label}</p>
            <p className="mt-2 min-h-10 text-xs leading-5 text-white/45">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Visitors" value={formatNumber(data.traffic.visitors)} detail="Unique hashed visitors, 30 days" />
        <AdminStat label="Sessions" value={formatNumber(data.traffic.sessions)} detail="Unique hashed sessions" />
        <AdminStat label="Organic clicks" value={formatNumber(data.seo.organicClicks)} detail={`${formatNumber(data.seo.impressions)} impressions`} />
        <AdminStat label="Lead conversion" value={formatPercent(data.traffic.conversionRate)} detail={`${formatNumber(data.traffic.formSubmits)} form submits`} />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Total leads" value={formatNumber(data.leads.total)} detail="All captured inquiries" />
        <AdminStat label="New leads" value={formatNumber(data.leads.new)} detail="Needs first response" />
        <AdminStat label="Qualified" value={formatNumber(data.leads.qualified)} detail="Sales-ready pipeline" />
        <AdminStat label="Won" value={formatNumber(data.leads.won)} detail="Closed from website" />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {data.industryPerformance.map((industry) => (
          <div key={industry.industry} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">{industry.label}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Metric label="Visits" value={formatNumber(industry.visits)} />
              <Metric label="Clicks" value={formatNumber(industry.organicClicks)} />
              <Metric label="CTR" value={formatPercent(industry.ctr)} />
              <Metric label="Leads" value={formatNumber(industry.leads)} />
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs text-white/45">
                <span>Position</span>
                <span className="text-white">{industry.averagePosition || '-'}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/45">
                <span>Conversion</span>
                <span className="text-white">{formatPercent(industry.conversionRate)}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Industry funnel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                <tr>
                  {['Industry', 'Impressions', 'Clicks', 'Visitors', 'CTA', 'Starts', 'Submits', 'Qualified', 'Won'].map((header) => (
                    <th key={header} className="px-3 py-2 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.industryPerformance.map((industry) => (
                  <tr key={industry.industry} className="text-white/60">
                    <td className="px-3 py-3 font-medium text-white">{industry.label}</td>
                    <td className="px-3 py-3">{formatNumber(industry.impressions)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.organicClicks)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.visits)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.ctaClicks)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.formStarts)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.formSubmits)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.qualified)}</td>
                    <td className="px-3 py-3">{formatNumber(industry.won)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Channel split">
          <div className="space-y-3">
            {data.channelSplit.length === 0 ? (
              <p className="text-sm text-white/40">No channel-attributed events yet.</p>
            ) : (
              data.channelSplit.map((channel: { channel: string; label: string; events: number }) => (
                <div key={channel.channel} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm">
                  <span className="text-white/60">{channel.label}</span>
                  <span className="text-white">{formatNumber(channel.events)}</span>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Top SEO pages">
          <SeoRows rows={data.seo.topPages} empty="No Search Console page rows imported yet." />
        </Panel>

        <Panel title="Top SEO queries">
          <SeoRows rows={data.seo.topQueries} empty="No Search Console query rows imported yet." queryMode />
        </Panel>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Recent leads" action={<Link href="/admin/leads" className="text-xs font-semibold text-teal hover:text-primary-hover">Open leads</Link>}>
          <div className="divide-y divide-white/10">
            {data.leads.recent.length === 0 ? (
              <p className="py-4 text-sm text-white/40">No leads captured yet.</p>
            ) : (
              data.leads.recent.map((lead: {
                id: string;
                name: string;
                company: string | null;
                serviceInterest: string;
                industry: string;
                status: string;
                score: number;
              }) => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="grid gap-2 py-4 transition-colors hover:bg-white/[0.02] md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium text-white">{lead.name}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {lead.company || 'No company'} · {lead.industry} · {lead.serviceInterest}
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
        </Panel>

        <Panel title="Static + CMS inventory">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Services" value={data.content.services} detail={`${data.content.staticServices} static / ${data.content.cmsServices} CMS`} />
            <MetricCard label="Case studies" value={data.content.caseStudies} detail={`${data.content.staticCaseStudies} static / ${data.content.cmsCaseStudies} CMS`} />
            <MetricCard label="Insights" value={data.content.insights} detail={`${data.content.staticInsights} static / ${data.content.cmsInsights} CMS`} />
            <MetricCard label="FAQs" value={data.content.faqs} detail="CMS only" />
          </div>
          <div className="mt-4 space-y-2">
            {data.content.byIndustry.map((item) => (
              <div key={item.industry} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm">
                <span className="text-white/60">{item.label}</span>
                <span className="text-white">{item.total} assets</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">Seed status</p>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Expected {data.content.seedStatus.expected.services} services, {data.content.seedStatus.expected.caseStudies} case studies, {data.content.seedStatus.expected.insights} insights.
              Current backend has {data.content.seedStatus.actual.services} services, {data.content.seedStatus.actual.caseStudies} case studies, {data.content.seedStatus.actual.insights} insights.
            </p>
            {(data.content.seedStatus.missing.services.length > 0 || data.content.seedStatus.missing.caseStudies.length > 0 || data.content.seedStatus.missing.insights.length > 0) && (
              <p className="mt-2 text-xs text-amber-200">Run npm run db:seed:content to fill missing backend content.</p>
            )}
          </div>
        </Panel>
      </section>

      <section className="mt-6">
        <Panel title="Content control matrix" action={<Link href="/admin/content/services" className="text-xs font-semibold text-teal hover:text-primary-hover">Open content admin</Link>}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <MetricCard label="DB controlled routes" value={ownershipSummary.dbControlled} detail="Editable from admin" />
            <MetricCard label="Mixed routes" value={ownershipSummary.mixed} detail="DB + static fallback" />
            <MetricCard label="Code-managed routes" value={ownershipSummary.staticCode} detail="Requires engineering update" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                <tr>
                  <th className="px-3 py-2 font-semibold">Route</th>
                  <th className="px-3 py-2 font-semibold">Ownership</th>
                  <th className="px-3 py-2 font-semibold">Admin editable</th>
                  <th className="px-3 py-2 font-semibold">Admin section</th>
                  <th className="px-3 py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {ownershipMatrix.map((row) => (
                  <tr key={row.route} className="text-white/60">
                    <td className="px-3 py-3 font-medium text-white">{row.route}</td>
                    <td className="px-3 py-3">{row.level}</td>
                    <td className="px-3 py-3">{row.editableInAdmin ? 'Yes' : 'No'}</td>
                    <td className="px-3 py-3">
                      {row.adminSection ? (
                        <Link href={row.adminSection} className="text-teal hover:text-primary-hover">{row.adminSection}</Link>
                      ) : (
                        <span className="text-white/35">Code only</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-white/45">{row.ownerNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>

      <div className="mt-8">
        <Panel title="SEO action queue" action={<Link href="/admin/settings" className="text-xs font-semibold text-teal hover:text-primary-hover">Settings</Link>}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.actionQueue.map((action) => (
              <div key={action.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">{action.priority}</span>
                <h3 className="mt-3 text-sm font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/45">{action.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{formatNumber(value)}</p>
      <p className="mt-1 text-xs text-white/40">{detail}</p>
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">{queryMode ? row.query : row.page}</p>
              <p className="mt-1 break-all text-xs text-white/35">{queryMode ? row.page : row.label}</p>
            </div>
            <span className="shrink-0 rounded-full bg-teal/10 px-2 py-1 text-[10px] text-teal">{row.label}</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-xs">
            <Metric label="Clicks" value={formatNumber(row.clicks)} />
            <Metric label="Impr." value={formatNumber(row.impressions)} />
            <Metric label="CTR" value={formatPercent(row.ctr)} />
            <Metric label="Pos." value={row.averagePosition ? String(row.averagePosition) : '-'} />
          </div>
        </div>
      ))}
    </div>
  );
}
