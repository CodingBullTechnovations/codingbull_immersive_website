import { NextResponse } from 'next/server';
import { AnalyticsEventType, SeoIndustry, TrafficChannel } from '@prisma/client';
import { z } from 'zod';
import { getIndustryForPath, getLandingPage, getTrafficChannel, industries, trafficChannels } from '@/lib/industry';
import { prisma } from '@/lib/server/prisma';
import { hashValue } from '@/lib/server/crypto';

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
    if (page.startsWith('/admin') || page.startsWith('/api') || page.startsWith('/_next')) {
      return NextResponse.json({ ok: true });
    }

    const industry = (parsed.data.industry ?? getIndustryForPath(page)) as SeoIndustry;
    const trafficChannel = (parsed.data.trafficChannel ??
      getTrafficChannel(parsed.data.referrer, parsed.data.utmMedium, parsed.data.utmSource)) as TrafficChannel;
    const landingPage = getLandingPage(page, parsed.data.landingPage);
    const sessionIdHash = hashValue(parsed.data.sessionId);
    const visitorIdHash = hashValue(parsed.data.visitorId ?? parsed.data.sessionId);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const increment = getDailyMetricIncrement(type);

    await prisma.$transaction([
      prisma.analyticsEvent.create({
        data: {
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
          metadata: parsed.data.params ?? {},
        },
      }),
      prisma.pageMetricDaily.upsert({
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
      }),
    ]);

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
