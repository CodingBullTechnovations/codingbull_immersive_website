import { SeoSyncProvider, type SeoIndustry, type TrafficChannel } from '@prisma/client';
import { caseStudies } from '@/content/case-studies';
import { insights } from '@/content/insights';
import { services } from '@/content/services';
import { coreIndustries, getIndustryForPath, industryLabels } from '@/lib/industry';
import { subDays } from '@/lib/server/date';
import { prisma } from '@/lib/server/prisma';

type HealthStatus = 'ok' | 'missing_credentials' | 'not_configured' | 'error';

const defaultTraffic = { visits: 0, ctaClicks: 0, formStarts: 0, formSubmits: 0, whatsappClicks: 0 };

function baseIndustryMetric(industry: SeoIndustry) {
  return {
    industry,
    label: industryLabels[industry],
    visits: 0,
    sessions: 0,
    users: 0,
    organicClicks: 0,
    impressions: 0,
    ctr: 0,
    averagePosition: 0,
    leads: 0,
    qualified: 0,
    won: 0,
    ctaClicks: 0,
    formStarts: 0,
    formSubmits: 0,
    whatsappClicks: 0,
    conversionRate: 0,
  };
}

function getStaticContentInventory() {
  const staticCaseStudies = caseStudies.length;
  const staticInsights = insights.length;
  const staticServices = services.length;

  const byIndustry = coreIndustries.map((industry) => {
    const serviceCount = services.filter((service) => getIndustryForPath(`/services/${service.slug}`) === industry).length;
    const insightCount = insights.filter((post) => getIndustryForPath(`/insights/${post.slug}`) === industry).length;
    const caseStudyCount = caseStudies.filter((study) => getIndustryForPath(`/case-studies/${study.slug}`) === industry).length;

    return {
      industry,
      label: industryLabels[industry],
      services: serviceCount,
      insights: insightCount,
      caseStudies: caseStudyCount,
      total: serviceCount + insightCount + caseStudyCount,
    };
  });

  return { staticServices, staticInsights, staticCaseStudies, byIndustry };
}

function calculateCtr(clicks: number, impressions: number) {
  return impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
}

function calculateRate(numerator: number, denominator: number) {
  return denominator > 0 ? Number(((numerator / denominator) * 100).toFixed(2)) : 0;
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown database error';
}

function getExternalStatus(saved?: Array<{ provider: string; key: string }>) {
  const hasSaved = (provider: string, key: string) => saved?.some((item) => item.provider === provider && item.key === key);
  const hasGaId = Boolean(process.env.NEXT_PUBLIC_GA_ID || hasSaved('GA4', 'measurement_id'));
  const hasGscSite = Boolean(process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || hasSaved('SEARCH_CONSOLE', 'site_url'));
  const hasGoogleCreds = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_REFRESH_TOKEN ||
    hasSaved('GOOGLE', 'refresh_token')
  );
  const hasGa4Property = Boolean(process.env.GA4_PROPERTY_ID || hasSaved('GA4', 'property_id'));

  return {
    ga4: {
      status: hasGaId ? 'ok' as HealthStatus : 'missing_credentials' as HealthStatus,
      detail: hasGaId ? 'GA4 measurement ID configured' : 'NEXT_PUBLIC_GA_ID is missing',
    },
    searchConsole: {
      status: hasGscSite && hasGoogleCreds ? 'ok' as HealthStatus : 'missing_credentials' as HealthStatus,
      detail: hasGscSite && hasGoogleCreds
        ? 'Search Console site and API credentials configured'
        : 'Set GOOGLE_SEARCH_CONSOLE_SITE_URL and Google API credentials',
    },
    ga4DataApi: {
      status: hasGa4Property && hasGoogleCreds ? 'ok' as HealthStatus : 'not_configured' as HealthStatus,
      detail: hasGa4Property && hasGoogleCreds ? 'GA4 Data API credentials configured' : 'GA4 Data API import is not configured',
    },
  };
}

function emptyDashboard(databaseStatus: HealthStatus, databaseDetail: string) {
  const staticInventory = getStaticContentInventory();

  return {
    health: {
      database: { status: databaseStatus, detail: databaseDetail },
      firstPartyAnalytics: { status: databaseStatus, detail: databaseStatus === 'ok' ? 'Ready to receive page_view events' : databaseDetail },
      analyticsLastError: { status: databaseStatus, detail: databaseStatus === 'ok' ? 'No analytics API error recorded' : databaseDetail },
      ...getExternalStatus(),
    },
    leads: {
      total: 0,
      new: 0,
      qualified: 0,
      won: 0,
      recent: [],
    },
    traffic: { ...defaultTraffic, visitors: 0, sessions: 0, conversionRate: 0 },
    seo: {
      organicClicks: 0,
      impressions: 0,
      ctr: 0,
      averagePosition: 0,
      topPages: [],
      topQueries: [],
      syncStatus: [],
    },
    channelSplit: [],
    industryPerformance: coreIndustries.map((industry) => baseIndustryMetric(industry as SeoIndustry)),
    content: {
      services: staticInventory.staticServices,
      caseStudies: staticInventory.staticCaseStudies,
      insights: staticInventory.staticInsights,
      testimonials: 0,
      faqs: 0,
      staticServices: staticInventory.staticServices,
      staticCaseStudies: staticInventory.staticCaseStudies,
      staticInsights: staticInventory.staticInsights,
      cmsServices: 0,
      cmsCaseStudies: 0,
      cmsInsights: 0,
      byIndustry: staticInventory.byIndustry,
      seedStatus: {
        expected: {
          services: staticInventory.staticServices,
          caseStudies: staticInventory.staticCaseStudies,
          insights: staticInventory.staticInsights,
        },
        actual: { services: 0, caseStudies: 0, insights: 0 },
        missing: {
          services: services.map((item) => item.slug),
          caseStudies: caseStudies.map((item) => item.slug),
          insights: insights.map((item) => item.slug),
        },
      },
    },
    actionQueue: buildActionQueue({
      databaseOk: databaseStatus === 'ok',
      hasPageViews: false,
      hasSearchData: false,
      hasGa4: process.env.NEXT_PUBLIC_GA_ID,
      hasSearchConsole: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
    }),
  };
}

export async function getAdminDashboardData() {
  const since = subDays(new Date(), 30);

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    return emptyDashboard('error', formatError(error));
  }

  try {
    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      recentLeads,
      dailyMetrics,
      analyticsEvents,
      leadIndustryGroups,
      searchRows,
      ga4Rows,
      contentCounts,
      syncStatus,
    channelGroups,
    topPages,
    topQueries,
    lastPageView,
      analyticsLastError,
      seededSlugs,
      credentialSummaries,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { status: 'WON' } }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          company: true,
          serviceInterest: true,
          industry: true,
          status: true,
          score: true,
          createdAt: true,
        },
      }),
      prisma.pageMetricDaily.findMany({
        where: { date: { gte: since } },
        orderBy: { date: 'asc' },
      }),
      prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { sessionIdHash: true, visitorIdHash: true },
      }),
      prisma.lead.groupBy({
        by: ['industry', 'status'],
        _count: { _all: true },
        where: { createdAt: { gte: since } },
      }),
      prisma.searchPerformanceDaily.findMany({
        where: { date: { gte: since } },
        orderBy: [{ clicks: 'desc' }, { impressions: 'desc' }],
      }),
      prisma.ga4LandingPageDaily.findMany({
        where: { date: { gte: since } },
        orderBy: [{ sessions: 'desc' }],
      }),
      Promise.all([
        prisma.servicePage.count(),
        prisma.caseStudy.count(),
        prisma.insightPost.count(),
        prisma.testimonial.count(),
        prisma.fAQ.count(),
      ]),
      prisma.seoSyncStatus.findMany({ orderBy: { provider: 'asc' } }),
      prisma.analyticsEvent.groupBy({
        by: ['trafficChannel'],
        _count: { _all: true },
        where: { createdAt: { gte: since } },
      }),
      prisma.searchPerformanceDaily.groupBy({
        by: ['page', 'industry'],
        _sum: { clicks: true, impressions: true },
        _avg: { averagePosition: true },
        where: { date: { gte: since } },
        orderBy: { _sum: { clicks: 'desc' } },
        take: 10,
      }),
      prisma.searchPerformanceDaily.groupBy({
        by: ['query', 'page', 'industry'],
        _sum: { clicks: true, impressions: true },
        _avg: { averagePosition: true },
        where: { date: { gte: since } },
        orderBy: { _sum: { clicks: 'desc' } },
        take: 10,
      }),
      prisma.analyticsEvent.findFirst({
        where: { type: 'PAGE_VIEW' },
        orderBy: { createdAt: 'desc' },
        select: { page: true, createdAt: true },
      }),
      prisma.siteSetting.findUnique({
        where: { key: 'analytics.lastError' },
        select: { value: true },
      }),
      Promise.all([
        prisma.servicePage.findMany({ select: { slug: true } }),
        prisma.caseStudy.findMany({ select: { slug: true } }),
        prisma.insightPost.findMany({ select: { slug: true } }),
      ]),
      prisma.integrationCredential.findMany({ select: { provider: true, key: true } }),
    ]);

    const traffic = dailyMetrics.reduce(
      (acc, day) => ({
        visits: acc.visits + day.visits,
        ctaClicks: acc.ctaClicks + day.ctaClicks,
        formStarts: acc.formStarts + day.formStarts,
        formSubmits: acc.formSubmits + day.formSubmits,
        whatsappClicks: acc.whatsappClicks + day.whatsappClicks,
      }),
      { ...defaultTraffic },
    );

    const visitors = new Set(analyticsEvents.map((event) => event.visitorIdHash).filter(Boolean)).size;
    const sessions = new Set(analyticsEvents.map((event) => event.sessionIdHash).filter(Boolean)).size;
    const organicClicks = searchRows.reduce((sum, row) => sum + row.clicks, 0);
    const impressions = searchRows.reduce((sum, row) => sum + row.impressions, 0);
    const weightedPosition = searchRows.reduce((sum, row) => sum + row.averagePosition * Math.max(row.impressions, 1), 0);
    const positionWeight = searchRows.reduce((sum, row) => sum + Math.max(row.impressions, 1), 0);

    const industryPerformance = coreIndustries.map((industry) => {
      const metric = baseIndustryMetric(industry as SeoIndustry);
      const industryTraffic = dailyMetrics.filter((day) => day.industry === industry);
      const industrySearch = searchRows.filter((row) => row.industry === industry);
      const industryGa4 = ga4Rows.filter((row) => row.industry === industry);
      const industryLeadGroups = leadIndustryGroups.filter((group) => group.industry === industry);

      metric.visits = industryTraffic.reduce((sum, day) => sum + day.visits, 0);
      metric.ctaClicks = industryTraffic.reduce((sum, day) => sum + day.ctaClicks, 0);
      metric.formStarts = industryTraffic.reduce((sum, day) => sum + day.formStarts, 0);
      metric.formSubmits = industryTraffic.reduce((sum, day) => sum + day.formSubmits, 0);
      metric.whatsappClicks = industryTraffic.reduce((sum, day) => sum + day.whatsappClicks, 0);
      metric.sessions = industryGa4.reduce((sum, row) => sum + row.sessions, 0);
      metric.users = industryGa4.reduce((sum, row) => sum + row.users, 0);
      metric.organicClicks = industrySearch.reduce((sum, row) => sum + row.clicks, 0);
      metric.impressions = industrySearch.reduce((sum, row) => sum + row.impressions, 0);
      metric.ctr = calculateCtr(metric.organicClicks, metric.impressions);
      metric.averagePosition = averagePosition(industrySearch);
      metric.leads = industryLeadGroups.reduce((sum, group) => sum + group._count._all, 0);
      metric.qualified = industryLeadGroups.filter((group) => group.status === 'QUALIFIED').reduce((sum, group) => sum + group._count._all, 0);
      metric.won = industryLeadGroups.filter((group) => group.status === 'WON').reduce((sum, group) => sum + group._count._all, 0);
      metric.conversionRate = calculateRate(metric.formSubmits || metric.leads, metric.visits || metric.organicClicks);

      return metric;
    });

    const staticInventory = getStaticContentInventory();
    const seededServiceSlugs = new Set(seededSlugs[0].map((item) => item.slug));
    const seededCaseStudySlugs = new Set(seededSlugs[1].map((item) => item.slug));
    const seededInsightSlugs = new Set(seededSlugs[2].map((item) => item.slug));
    const missingSeedSlugs = {
      services: services.map((item) => item.slug).filter((slug) => !seededServiceSlugs.has(slug)),
      caseStudies: caseStudies.map((item) => item.slug).filter((slug) => !seededCaseStudySlugs.has(slug)),
      insights: insights.map((item) => item.slug).filter((slug) => !seededInsightSlugs.has(slug)),
    };
    const contentByIndustry = staticInventory.byIndustry.map((item) => ({
      ...item,
      cmsServices: 0,
      cmsInsights: 0,
      cmsCaseStudies: 0,
      total: item.total,
    }));

    return {
      health: {
        database: { status: 'ok' as HealthStatus, detail: 'PostgreSQL reachable' },
        firstPartyAnalytics: {
          status: traffic.visits > 0 ? 'ok' as HealthStatus : 'not_configured' as HealthStatus,
          detail: traffic.visits > 0
            ? `Last page view: ${lastPageView?.page ?? 'unknown'}`
            : 'No page_view rows in the last 30 days yet',
        },
        analyticsLastError: {
          status: analyticsLastError?.value ? 'error' as HealthStatus : 'ok' as HealthStatus,
          detail: analyticsLastError?.value ? String(analyticsLastError.value) : 'No analytics API error recorded',
        },
        ...getExternalStatus(credentialSummaries),
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        qualified: qualifiedLeads,
        won: wonLeads,
        recent: recentLeads,
      },
      traffic: {
        ...traffic,
        visitors,
        sessions,
        conversionRate: calculateRate(traffic.formSubmits, traffic.visits),
      },
      seo: {
        organicClicks,
        impressions,
        ctr: calculateCtr(organicClicks, impressions),
        averagePosition: positionWeight > 0 ? Number((weightedPosition / positionWeight).toFixed(1)) : 0,
        topPages: topPages.map((row) => ({
          page: row.page,
          industry: row.industry,
          label: industryLabels[row.industry],
          clicks: row._sum.clicks ?? 0,
          impressions: row._sum.impressions ?? 0,
          ctr: calculateCtr(row._sum.clicks ?? 0, row._sum.impressions ?? 0),
          averagePosition: Number((row._avg.averagePosition ?? 0).toFixed(1)),
        })),
        topQueries: topQueries.map((row) => ({
          query: row.query,
          page: row.page,
          industry: row.industry,
          label: industryLabels[row.industry],
          clicks: row._sum.clicks ?? 0,
          impressions: row._sum.impressions ?? 0,
          ctr: calculateCtr(row._sum.clicks ?? 0, row._sum.impressions ?? 0),
          averagePosition: Number((row._avg.averagePosition ?? 0).toFixed(1)),
        })),
        syncStatus,
      },
      channelSplit: channelGroups.map((group) => ({
        channel: group.trafficChannel,
        label: formatChannel(group.trafficChannel),
        events: group._count._all,
      })),
      industryPerformance,
      content: {
        services: staticInventory.staticServices + contentCounts[0],
        caseStudies: staticInventory.staticCaseStudies + contentCounts[1],
        insights: staticInventory.staticInsights + contentCounts[2],
        testimonials: contentCounts[3],
        faqs: contentCounts[4],
        staticServices: staticInventory.staticServices,
        staticCaseStudies: staticInventory.staticCaseStudies,
        staticInsights: staticInventory.staticInsights,
        cmsServices: contentCounts[0],
        cmsCaseStudies: contentCounts[1],
        cmsInsights: contentCounts[2],
        byIndustry: contentByIndustry,
        seedStatus: {
          expected: {
            services: staticInventory.staticServices,
            caseStudies: staticInventory.staticCaseStudies,
            insights: staticInventory.staticInsights,
          },
          actual: {
            services: contentCounts[0],
            caseStudies: contentCounts[1],
            insights: contentCounts[2],
          },
          missing: missingSeedSlugs,
        },
      },
      actionQueue: buildActionQueue({
        databaseOk: true,
        hasPageViews: traffic.visits > 0,
        hasSearchData: organicClicks > 0 || impressions > 0,
        hasGa4: process.env.NEXT_PUBLIC_GA_ID,
        hasSearchConsole: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
      }),
    };
  } catch (error) {
    return emptyDashboard('error', formatError(error));
  }
}

function averagePosition(rows: Array<{ averagePosition: number; impressions: number }>) {
  const weighted = rows.reduce((sum, row) => sum + row.averagePosition * Math.max(row.impressions, 1), 0);
  const weight = rows.reduce((sum, row) => sum + Math.max(row.impressions, 1), 0);
  return weight > 0 ? Number((weighted / weight).toFixed(1)) : 0;
}

function formatChannel(channel: TrafficChannel) {
  return channel.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (char) => char.toUpperCase());
}

function buildActionQueue(input: {
  databaseOk: boolean;
  hasPageViews: boolean;
  hasSearchData: boolean;
  hasGa4?: string;
  hasSearchConsole?: string;
}) {
  const actions = [];

  if (!input.databaseOk) {
    actions.push({ priority: 'Critical', title: 'Start PostgreSQL and apply migrations', detail: 'Dashboard cannot read analytics or leads until the database is reachable.' });
  }

  if (!input.hasPageViews) {
    actions.push({ priority: 'High', title: 'Verify first public page_view event', detail: 'Open a public page locally or in production, then confirm Visits increments.' });
  }

  if (!input.hasSearchConsole) {
    actions.push({ priority: 'High', title: 'Connect Google Search Console', detail: 'Set GOOGLE_SEARCH_CONSOLE_SITE_URL and API credentials before query/ranking imports can run.' });
  }

  if (!input.hasGa4) {
    actions.push({ priority: 'High', title: 'Add GA4 measurement ID', detail: 'Set NEXT_PUBLIC_GA_ID after creating the GA4 web stream.' });
  }

  if (!input.hasSearchData) {
    actions.push({ priority: 'Medium', title: 'Import Search Console performance', detail: 'Load query/page rows to identify which industry SEO is producing clicks and impressions.' });
  }

  actions.push(
    { priority: 'Medium', title: 'Improve CTR pages', detail: 'Rewrite titles/meta for pages with impressions but low CTR.' },
    { priority: 'Medium', title: 'Add proof links by industry', detail: 'Link every pillar page to matching case studies, insights, and FAQs.' },
    { priority: 'Low', title: 'Refresh stale content', detail: 'Update pages with no traffic or old proof before publishing new generic posts.' },
  );

  return actions.slice(0, 8);
}

export { SeoSyncProvider };
