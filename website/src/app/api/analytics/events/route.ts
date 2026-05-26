import { NextResponse } from 'next/server';
import { AnalyticsEventType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/server/prisma';
import { hashValue } from '@/lib/server/crypto';

export const runtime = 'nodejs';

const analyticsEventSchema = z.object({
  name: z.string().max(80),
  page: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(120).optional(),
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
    const sessionIdHash = hashValue(parsed.data.sessionId);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const increment = getDailyMetricIncrement(type);

    await prisma.$transaction([
      prisma.analyticsEvent.create({
        data: {
          type,
          page,
          sessionIdHash,
          referrer: parsed.data.referrer || null,
          metadata: parsed.data.params ?? {},
        },
      }),
      prisma.pageMetricDaily.upsert({
        where: {
          date_page: {
            date: today,
            page,
          },
        },
        create: {
          date: today,
          page,
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
    console.error('[analytics_event_failed]', error);
    return NextResponse.json({ ok: true }, { status: 202 });
  }
}
