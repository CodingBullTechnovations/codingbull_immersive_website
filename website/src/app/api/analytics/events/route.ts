import { NextResponse } from 'next/server';
import { AnalyticsEventType, SeoIndustry, TrafficChannel } from '@prisma/client';
import { z } from 'zod';
import { getIndustryForPath, getLandingPage, getTrafficChannel, industries, trafficChannels } from '@/lib/industry';
import { prisma } from '@/lib/server/prisma';
import { getClientIp, hashValue } from '@/lib/server/crypto';

export const runtime = 'nodejs';

const analyticsEventSchema = z.object({
  name: z.string().max(80),
  page: z.string().max(300).optional(),
  landingPage: z.string().max(300).optional(),
  industry: z.enum(industries).optional(),
  trafficChannel: z.enum(trafficChannels).optional(),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(120).optional(),
  visitorId: z.string().max(120).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(160).optional(),
  params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  clientContext: z.object({
    screenWidth: z.number().int().positive().max(20000).optional(),
    screenHeight: z.number().int().positive().max(20000).optional(),
    viewportWidth: z.number().int().positive().max(20000).optional(),
    viewportHeight: z.number().int().positive().max(20000).optional(),
    timezone: z.string().max(120).optional(),
    language: z.string().max(80).optional(),
    platform: z.string().max(160).optional(),
    colorScheme: z.string().max(30).optional(),
    touchEnabled: z.boolean().optional(),
  }).optional(),
});

const eventMap: Record<string, AnalyticsEventType> = {
  page_view: AnalyticsEventType.PAGE_VIEW,
  cta_click: AnalyticsEventType.CTA_CLICK,
  whatsapp_click: AnalyticsEventType.WHATSAPP_CLICK,
  phone_click: AnalyticsEventType.PHONE_CLICK,
  email_click: AnalyticsEventType.EMAIL_CLICK,
  form_start: AnalyticsEventType.FORM_START,
  form_submit: AnalyticsEventType.FORM_SUBMIT,
  case_study_click: AnalyticsEventType.CASE_STUDY_CLICK,
  scroll_depth: AnalyticsEventType.SCROLL_DEPTH,
};

function getDailyMetricIncrement(type: AnalyticsEventType) {
  return {
    visits: type === AnalyticsEventType.PAGE_VIEW ? 1 : 0,
    ctaClicks: type === AnalyticsEventType.CTA_CLICK ? 1 : 0,
    formStarts: type === AnalyticsEventType.FORM_START ? 1 : 0,
    formSubmits: type === AnalyticsEventType.FORM_SUBMIT ? 1 : 0,
    whatsappClicks: type === AnalyticsEventType.WHATSAPP_CLICK ? 1 : 0,
  };
}

function shouldIgnorePath(path: string) {
  const normalized = path.split('?')[0] || '/';
  return (
    normalized.startsWith('/admin') ||
    normalized.startsWith('/api') ||
    normalized.startsWith('/_next') ||
    normalized === '/sitemap.xml' ||
    normalized === '/robots.txt' ||
    normalized === '/favicon.ico' ||
    /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|woff|woff2)$/i.test(normalized)
  );
}

function textHeader(headersList: Headers, key: string) {
  return headersList.get(key)?.trim() || null;
}

function parseUserAgent(userAgent: string | null) {
  const ua = userAgent ?? '';
  const match = (pattern: RegExp) => ua.match(pattern)?.[1];
  const browserMatch =
    match(/OPR\/([\d.]+)/) ? ['Opera', match(/OPR\/([\d.]+)/)] :
    match(/Edg\/([\d.]+)/) ? ['Edge', match(/Edg\/([\d.]+)/)] :
    match(/CriOS\/([\d.]+)/) ? ['Chrome iOS', match(/CriOS\/([\d.]+)/)] :
    match(/FxiOS\/([\d.]+)/) ? ['Firefox iOS', match(/FxiOS\/([\d.]+)/)] :
    match(/Chrome\/([\d.]+)/) ? ['Chrome', match(/Chrome\/([\d.]+)/)] :
    match(/Firefox\/([\d.]+)/) ? ['Firefox', match(/Firefox\/([\d.]+)/)] :
    match(/Version\/([\d.]+).*Safari/) ? ['Safari', match(/Version\/([\d.]+).*Safari/)] :
    ['Unknown', undefined];

  const osMatch =
    match(/Windows NT ([\d.]+)/) ? ['Windows', match(/Windows NT ([\d.]+)/)] :
    match(/Android ([\d.]+)/) ? ['Android', match(/Android ([\d.]+)/)] :
    match(/iPhone OS ([\d_]+)/) ? ['iOS', match(/iPhone OS ([\d_]+)/)?.replaceAll('_', '.')] :
    match(/CPU OS ([\d_]+)/) ? ['iPadOS', match(/CPU OS ([\d_]+)/)?.replaceAll('_', '.')] :
    match(/Mac OS X ([\d_]+)/) ? ['macOS', match(/Mac OS X ([\d_]+)/)?.replaceAll('_', '.')] :
    ua.includes('Linux') ? ['Linux', undefined] :
    ['Unknown', undefined];

  const deviceType = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';

  return {
    browser: browserMatch[0],
    browserVersion: browserMatch[1],
    os: osMatch[0],
    osVersion: osMatch[1],
    deviceType,
  };
}

function getGeoFromHeaders(headersList: Headers) {
  return {
    country: textHeader(headersList, 'cf-ipcountry') ?? textHeader(headersList, 'x-vercel-ip-country'),
    region: textHeader(headersList, 'x-vercel-ip-country-region') ?? textHeader(headersList, 'x-region'),
    city: textHeader(headersList, 'x-vercel-ip-city') ?? textHeader(headersList, 'x-city'),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const type = eventMap[parsed.data.name];
    if (!type) {
      return NextResponse.json({ ok: true });
    }

    const page = parsed.data.page || '/';
    if (shouldIgnorePath(page)) {
      return NextResponse.json({ ok: true });
    }

    const headersList = request.headers;
    const ipAddress = getClientIp(headersList);
    const userAgent = textHeader(headersList, 'user-agent');
    const ipHash = hashValue(ipAddress);
    const userAgentHash = hashValue(userAgent);
    const geo = getGeoFromHeaders(headersList);
    const parsedDevice = parseUserAgent(userAgent);
    const industry = (parsed.data.industry ?? getIndustryForPath(page)) as SeoIndustry;
    const trafficChannel = (parsed.data.trafficChannel ??
      getTrafficChannel(parsed.data.referrer, parsed.data.utmMedium, parsed.data.utmSource)) as TrafficChannel;
    const landingPage = getLandingPage(page, parsed.data.landingPage);
    const sessionIdHash = hashValue(parsed.data.sessionId);
    const visitorIdHash = hashValue(parsed.data.visitorId ?? parsed.data.sessionId);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const increment = getDailyMetricIncrement(type);
    const clientContext = parsed.data.clientContext ?? {};

    await prisma.$transaction(async (tx) => {
      let visitorSessionId: string | null = null;

      if (sessionIdHash && visitorIdHash) {
        const existingSession = await tx.visitorSession.findUnique({
          where: { sessionIdHash },
          select: { id: true },
        });

        const visitorProfile = await tx.visitorProfile.upsert({
          where: { visitorIdHash },
          create: {
            visitorIdHash,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
            totalSessions: existingSession ? 0 : 1,
            totalEvents: 1,
            latestIpAddress: ipAddress,
            latestCountry: geo.country,
            latestRegion: geo.region,
            latestCity: geo.city,
            latestDeviceType: parsedDevice.deviceType,
            latestBrowser: parsedDevice.browser,
            latestOs: parsedDevice.os,
          },
          update: {
            lastSeenAt: new Date(),
            totalSessions: existingSession ? undefined : { increment: 1 },
            totalEvents: { increment: 1 },
            latestIpAddress: ipAddress ?? undefined,
            latestCountry: geo.country ?? undefined,
            latestRegion: geo.region ?? undefined,
            latestCity: geo.city ?? undefined,
            latestDeviceType: parsedDevice.deviceType,
            latestBrowser: parsedDevice.browser,
            latestOs: parsedDevice.os,
          },
        });

        const visitorSession = await tx.visitorSession.upsert({
          where: { sessionIdHash },
          create: {
            sessionIdHash,
            visitorIdHash,
            visitorId: visitorProfile.id,
            ipAddress,
            userAgent,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            landingPage,
            lastPage: page,
            referrer: parsed.data.referrer || null,
            trafficChannel,
            utmSource: parsed.data.utmSource || null,
            utmMedium: parsed.data.utmMedium || null,
            utmCampaign: parsed.data.utmCampaign || null,
            ...parsedDevice,
            screenWidth: clientContext.screenWidth,
            screenHeight: clientContext.screenHeight,
            viewportWidth: clientContext.viewportWidth,
            viewportHeight: clientContext.viewportHeight,
            timezone: clientContext.timezone,
            language: clientContext.language,
            platform: clientContext.platform,
            touchEnabled: clientContext.touchEnabled,
            colorScheme: clientContext.colorScheme,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
            eventCount: 1,
          },
          update: {
            lastPage: page,
            ipAddress: ipAddress ?? undefined,
            userAgent: userAgent ?? undefined,
            country: geo.country ?? undefined,
            region: geo.region ?? undefined,
            city: geo.city ?? undefined,
            trafficChannel,
            ...parsedDevice,
            screenWidth: clientContext.screenWidth ?? undefined,
            screenHeight: clientContext.screenHeight ?? undefined,
            viewportWidth: clientContext.viewportWidth ?? undefined,
            viewportHeight: clientContext.viewportHeight ?? undefined,
            timezone: clientContext.timezone ?? undefined,
            language: clientContext.language ?? undefined,
            platform: clientContext.platform ?? undefined,
            touchEnabled: clientContext.touchEnabled ?? undefined,
            colorScheme: clientContext.colorScheme ?? undefined,
            lastSeenAt: new Date(),
            eventCount: { increment: 1 },
          },
        });

        visitorSessionId = visitorSession.id;
      }

      await tx.analyticsEvent.create({
        data: {
          visitorSessionId,
          type,
          page,
          landingPage,
          industry,
          trafficChannel,
          sessionIdHash,
          visitorIdHash,
          referrer: parsed.data.referrer || null,
          utmSource: parsed.data.utmSource || null,
          utmMedium: parsed.data.utmMedium || null,
          utmCampaign: parsed.data.utmCampaign || null,
          device: parsedDevice.deviceType,
          country: geo.country,
          metadata: {
            ...(parsed.data.params ?? {}),
            clientContext,
            ipHash,
            userAgentHash,
          },
        },
      });

      await tx.pageMetricDaily.upsert({
        where: {
          date_page_industry_trafficChannel: {
            date: today,
            page,
            industry,
            trafficChannel,
          },
        },
        create: {
          date: today,
          page,
          industry,
          trafficChannel,
          ...increment,
        },
        update: {
          visits: { increment: increment.visits },
          ctaClicks: { increment: increment.ctaClicks },
          formStarts: { increment: increment.formStarts },
          formSubmits: { increment: increment.formSubmits },
          whatsappClicks: { increment: increment.whatsappClicks },
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown analytics write error';
    const conciseMessage = message.includes('Unknown argument') || message.includes('does not exist')
      ? 'Analytics schema is not ready. Run npm run db:generate, npm run db:deploy, and restart the dev/server process.'
      : message;

    await prisma.siteSetting.upsert({
      where: { key: 'analytics.lastError' },
      update: { value: conciseMessage, description: 'Last analytics API write error.' },
      create: { key: 'analytics.lastError', value: conciseMessage, description: 'Last analytics API write error.' },
    }).catch(() => undefined);

    console.error('[analytics_event_failed]', conciseMessage);
    return NextResponse.json({ ok: false, error: conciseMessage }, { status: 202 });
  }
}
