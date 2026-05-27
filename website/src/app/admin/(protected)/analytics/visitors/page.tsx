import Link from 'next/link';
import { AnalyticsEventType, SeoIndustry, TrafficChannel } from '@prisma/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { prisma } from '@/lib/server/prisma';
import {
  deleteBeforeDateAction,
  deleteNonConvertedBeforeDateAction,
  deleteSessionAction,
  deleteVisitorAction,
  dismissRetentionReminderAction,
  markRetentionReviewedAction,
} from './actions';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateTime(date?: Date | null) {
  return date ? date.toLocaleString('en-IN') : '-';
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function buildDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function AdminVisitorAnalyticsPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = await (searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>));
  const fromDate = buildDate(firstParam(params.from));
  const toDate = buildDate(firstParam(params.to));
  const ip = firstParam(params.ip)?.trim();
  const visitorHash = firstParam(params.visitor)?.trim();
  const sessionHash = firstParam(params.session)?.trim();
  const landingPage = firstParam(params.landingPage)?.trim();
  const industry = firstParam(params.industry)?.trim() as SeoIndustry | undefined;
  const channel = firstParam(params.channel)?.trim() as TrafficChannel | undefined;
  const converted = firstParam(params.converted);
  const eventFilters = [
    ...(industry && Object.values(SeoIndustry).includes(industry) ? [{ events: { some: { industry } } }] : []),
    ...(converted === 'yes' ? [{ events: { some: { type: AnalyticsEventType.FORM_SUBMIT } } }] : []),
    ...(converted === 'no' ? [{ events: { none: { type: AnalyticsEventType.FORM_SUBMIT } } }] : []),
  ];

  const sessionWhere = {
    ...(fromDate || toDate
      ? {
          lastSeenAt: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: new Date(toDate.getTime() + 24 * 60 * 60 * 1000) } : {}),
          },
        }
      : {}),
    ...(ip ? { ipAddress: { contains: ip, mode: 'insensitive' as const } } : {}),
    ...(visitorHash ? { visitorIdHash: { contains: visitorHash, mode: 'insensitive' as const } } : {}),
    ...(sessionHash ? { sessionIdHash: { contains: sessionHash, mode: 'insensitive' as const } } : {}),
    ...(landingPage ? { landingPage: { contains: landingPage, mode: 'insensitive' as const } } : {}),
    ...(channel && Object.values(TrafficChannel).includes(channel) ? { trafficChannel: channel } : {}),
    ...(eventFilters.length > 0 ? { AND: eventFilters } : {}),
  };

  const [sessions, summary, oldestSession, retentionReview] = await Promise.all([
    prisma.visitorSession.findMany({
      where: sessionWhere,
      orderBy: { lastSeenAt: 'desc' },
      take: 80,
      include: {
        visitor: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 8,
          select: {
            id: true,
            type: true,
            page: true,
            industry: true,
            trafficChannel: true,
            createdAt: true,
          },
        },
        _count: { select: { events: true } },
      },
    }),
    Promise.all([
      prisma.visitorProfile.count(),
      prisma.visitorSession.count(),
      prisma.analyticsEvent.count(),
      prisma.visitorSession.count({ where: { events: { some: { type: AnalyticsEventType.FORM_SUBMIT } } } }),
    ]),
    prisma.visitorSession.findFirst({ orderBy: { firstSeenAt: 'asc' }, select: { firstSeenAt: true } }),
    prisma.analyticsRetentionReview.findFirst({ orderBy: { createdAt: 'asc' } }),
  ]);

  const now = new Date();
  const reviewDays = retentionReview?.reviewDueAfterDays ?? 30;
  const reviewBase = retentionReview?.lastReviewedAt ?? oldestSession?.firstSeenAt;
  const nextReviewAt = reviewBase ? new Date(reviewBase.getTime() + reviewDays * 24 * 60 * 60 * 1000) : null;
  const reminderDismissed = retentionReview?.dismissedUntil && retentionReview.dismissedUntil > now;
  const reviewDue = Boolean(nextReviewAt && nextReviewAt <= now && !reminderDismissed);
  const defaultDeleteAt = new Date(now);
  defaultDeleteAt.setDate(defaultDeleteAt.getDate() - 30);
  const defaultDeleteDate = dateInputValue(defaultDeleteAt);

  return (
    <>
      <AdminPageHeader
        title="Visitor Intelligence"
        description="First-party visitor sessions, readable IP/device details, conversion paths, and manual data deletion controls. This data is not sent to GA4."
        action={<Link href="/admin/analytics" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">Back to analytics</Link>}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard label="Visitor profiles" value={summary[0]} />
        <SummaryCard label="Sessions" value={summary[1]} />
        <SummaryCard label="Events" value={summary[2]} />
        <SummaryCard label="Converted sessions" value={summary[3]} />
      </section>

      <section className={`mt-6 rounded-2xl border p-5 ${reviewDue ? 'border-amber-300/30 bg-amber-300/[0.06]' : 'border-white/10 bg-white/[0.03]'}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Retention review</p>
            <p className="mt-2 text-sm text-white/50">
              Oldest session: {formatDateTime(oldestSession?.firstSeenAt)}. Review every {reviewDays} days.
              {nextReviewAt ? ` Next review: ${formatDateTime(nextReviewAt)}.` : ' No visitor sessions stored yet.'}
            </p>
            {reviewDue && <p className="mt-2 text-sm text-amber-100">Review is due. No data is auto-deleted; use the controls below if data is no longer needed.</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <form action={markRetentionReviewedAction} className="flex gap-2">
              <input
                name="notes"
                placeholder="Optional note"
                className="w-44 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
              />
              <button className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-black">Mark reviewed</button>
            </form>
            <form action={dismissRetentionReminderAction}>
              <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">Dismiss 7 days</button>
            </form>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="font-semibold text-white">Filters</p>
        <form className="mt-4 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          <FilterInput name="from" label="From" type="date" defaultValue={firstParam(params.from) ?? ''} />
          <FilterInput name="to" label="To" type="date" defaultValue={firstParam(params.to) ?? ''} />
          <FilterInput name="ip" label="IP" defaultValue={ip ?? ''} />
          <FilterInput name="visitor" label="Visitor hash" defaultValue={visitorHash ?? ''} />
          <FilterInput name="session" label="Session hash" defaultValue={sessionHash ?? ''} />
          <FilterInput name="landingPage" label="Landing page" defaultValue={landingPage ?? ''} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">Industry</span>
            <select name="industry" defaultValue={industry ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-[#101522] px-3 py-2 text-sm text-white">
              <option value="">Any</option>
              {Object.values(SeoIndustry).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">Converted</span>
            <select name="converted" defaultValue={converted ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-[#101522] px-3 py-2 text-sm text-white">
              <option value="">Any</option>
              <option value="yes">Converted</option>
              <option value="no">Not converted</option>
            </select>
          </label>
          <div className="md:col-span-4 xl:col-span-8">
            <button className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-black">Apply filters</button>
            <Link href="/admin/analytics/visitors" className="ml-3 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">Reset</Link>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-red-400/15 bg-red-400/[0.03] p-5">
        <p className="font-semibold text-white">Manual deletion controls</p>
        <p className="mt-2 text-sm text-white/45">These actions are permanent and audit-logged. No automatic deletion runs in the background.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <form action={deleteBeforeDateAction} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Delete first-party analytics before date</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <FilterInput name="beforeDate" label="Before date" type="date" defaultValue={defaultDeleteDate} />
              <FilterInput name="confirmation" label="Type DELETE ANALYTICS" defaultValue="" />
              <label className="flex items-center gap-2 pb-2 text-sm text-white/50">
                <input name="keepAggregates" type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-black" />
                Keep dashboard aggregates
              </label>
              <button className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-400/10">Delete</button>
            </div>
          </form>
          <form action={deleteNonConvertedBeforeDateAction} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Delete non-converted sessions before date</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <FilterInput name="beforeDate" label="Before date" type="date" defaultValue={defaultDeleteDate} />
              <FilterInput name="confirmation" label="Type DELETE NON-CONVERTED" defaultValue="" />
              <button className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-400/10">Delete non-converted</button>
            </div>
          </form>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-5 py-4 font-semibold text-white">Sessions</div>
        {sessions.length === 0 ? (
          <p className="px-5 py-10 text-sm text-white/45">No visitor sessions match the current filters.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {sessions.map((visitorSession) => (
              <article key={visitorSession.id} className="p-5">
                <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_auto] xl:items-start">
                  <div>
                    <p className="font-semibold text-white">{visitorSession.landingPage || visitorSession.lastPage || 'Unknown landing page'}</p>
                    <p className="mt-1 break-all text-xs text-white/40">Last page: {visitorSession.lastPage || '-'}</p>
                    <p className="mt-2 text-xs text-white/35">Referrer: {visitorSession.referrer || 'Direct / unavailable'}</p>
                  </div>
                  <div className="text-sm text-white/55">
                    <p>IP: <span className="text-white">{visitorSession.ipAddress || '-'}</span></p>
                    <p>Country: {visitorSession.country || '-'} {visitorSession.region || ''} {visitorSession.city || ''}</p>
                    <p>Channel: {visitorSession.trafficChannel}</p>
                    <p>UTM: {[visitorSession.utmSource, visitorSession.utmMedium, visitorSession.utmCampaign].filter(Boolean).join(' / ') || '-'}</p>
                  </div>
                  <div className="text-sm text-white/55">
                    <p>{visitorSession.deviceType || '-'} · {visitorSession.browser || '-'} · {visitorSession.os || '-'}</p>
                    <p>{visitorSession.viewportWidth || '-'}x{visitorSession.viewportHeight || '-'} viewport</p>
                    <p>{visitorSession.screenWidth || '-'}x{visitorSession.screenHeight || '-'} screen</p>
                    <p>{visitorSession.language || '-'} · {visitorSession.timezone || '-'}</p>
                  </div>
                  <div className="flex gap-2 xl:flex-col">
                    <form action={deleteSessionAction}>
                      <input type="hidden" name="visitorSessionId" value={visitorSession.id} />
                      <input name="confirmation" placeholder="Type DELETE" className="mb-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-white/25" />
                      <button className="rounded-lg border border-red-400/25 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-400/10">Delete session</button>
                    </form>
                    <form action={deleteVisitorAction}>
                      <input type="hidden" name="visitorId" value={visitorSession.visitor.id} />
                      <input name="confirmation" placeholder="Type DELETE" className="mb-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-white/25" />
                      <button className="rounded-lg border border-red-400/25 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-400/10">Delete visitor</button>
                    </form>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35">
                    <span>Session hash: {visitorSession.sessionIdHash.slice(0, 16)}...</span>
                    <span>Visitor hash: {visitorSession.visitorIdHash.slice(0, 16)}...</span>
                    <span>First seen: {formatDateTime(visitorSession.firstSeenAt)}</span>
                    <span>Last seen: {formatDateTime(visitorSession.lastSeenAt)}</span>
                    <span>Events: {formatNumber(visitorSession._count.events)}</span>
                  </div>
                  <div className="mt-3 grid gap-2 lg:grid-cols-2">
                    {visitorSession.events.map((event) => (
                      <div key={event.id} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50">
                        <span className="font-semibold text-white">{event.type}</span> · {event.industry} · {event.page}
                        <span className="block text-white/30">{formatDateTime(event.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{formatNumber(value)}</p>
    </div>
  );
}

function FilterInput({
  name,
  label,
  defaultValue,
  type = 'text',
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
      />
    </label>
  );
}
