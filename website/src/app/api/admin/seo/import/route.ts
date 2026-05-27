import { NextResponse } from 'next/server';
import { SeoSyncProvider } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/auth';
import { getIndustryForPath, getTrafficChannel } from '@/lib/industry';
import { hasRole } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';

const searchConsoleRowSchema = z.object({
  date: z.string().min(8),
  query: z.string().min(1).max(500),
  page: z.string().min(1).max(500),
  country: z.string().max(80).optional(),
  device: z.string().max(80).optional(),
  clicks: z.number().int().nonnegative().default(0),
  impressions: z.number().int().nonnegative().default(0),
  ctr: z.number().min(0).default(0),
  averagePosition: z.number().min(0).default(0),
});

const ga4RowSchema = z.object({
  date: z.string().min(8),
  landingPage: z.string().min(1).max(500),
  source: z.string().max(160).optional(),
  medium: z.string().max(160).optional(),
  sessions: z.number().int().nonnegative().default(0),
  engagedSessions: z.number().int().nonnegative().default(0),
  users: z.number().int().nonnegative().default(0),
  conversions: z.number().int().nonnegative().default(0),
});

const importSchema = z.object({
  searchConsole: z.array(searchConsoleRowSchema).optional(),
  ga4: z.array(ga4RowSchema).optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = importSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid import payload' }, { status: 400 });
  }

  const searchConsoleRows = parsed.data.searchConsole ?? [];
  const ga4Rows = parsed.data.ga4 ?? [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const row of searchConsoleRows) {
        const date = parseDate(row.date);
        const industry = getIndustryForPath(row.page);
        const country = row.country || 'ALL';
        const device = row.device || 'ALL';

        await tx.searchPerformanceDaily.upsert({
          where: {
            date_query_page_country_device: {
              date,
              query: row.query,
              page: row.page,
              country,
              device,
            },
          },
          create: {
            date,
            query: row.query,
            page: row.page,
            country,
            device,
            industry,
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            averagePosition: row.averagePosition,
          },
          update: {
            industry,
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            averagePosition: row.averagePosition,
          },
        });
      }

      for (const row of ga4Rows) {
        const date = parseDate(row.date);
        const source = row.source || 'unknown';
        const medium = row.medium || 'unknown';
        const trafficChannel = getTrafficChannel(null, medium, source);
        const industry = getIndustryForPath(row.landingPage);

        await tx.ga4LandingPageDaily.upsert({
          where: {
            date_landingPage_source_medium: {
              date,
              landingPage: row.landingPage,
              source,
              medium,
            },
          },
          create: {
            date,
            landingPage: row.landingPage,
            source,
            medium,
            trafficChannel,
            industry,
            sessions: row.sessions,
            engagedSessions: row.engagedSessions,
            users: row.users,
            conversions: row.conversions,
          },
          update: {
            trafficChannel,
            industry,
            sessions: row.sessions,
            engagedSessions: row.engagedSessions,
            users: row.users,
            conversions: row.conversions,
          },
        });
      }

      if (searchConsoleRows.length > 0) {
        await tx.seoSyncStatus.upsert({
          where: { provider: SeoSyncProvider.SEARCH_CONSOLE },
          create: {
            provider: SeoSyncProvider.SEARCH_CONSOLE,
            lastSuccessfulAt: new Date(),
            lastAttemptedAt: new Date(),
            rowsImported: searchConsoleRows.length,
          },
          update: {
            lastSuccessfulAt: new Date(),
            lastAttemptedAt: new Date(),
            lastError: null,
            rowsImported: { increment: searchConsoleRows.length },
          },
        });
      }

      if (ga4Rows.length > 0) {
        await tx.seoSyncStatus.upsert({
          where: { provider: SeoSyncProvider.GA4 },
          create: {
            provider: SeoSyncProvider.GA4,
            lastSuccessfulAt: new Date(),
            lastAttemptedAt: new Date(),
            rowsImported: ga4Rows.length,
          },
          update: {
            lastSuccessfulAt: new Date(),
            lastAttemptedAt: new Date(),
            lastError: null,
            rowsImported: { increment: ga4Rows.length },
          },
        });
      }
    });

    return NextResponse.json({
      ok: true,
      imported: {
        searchConsole: searchConsoleRows.length,
        ga4: ga4Rows.length,
      },
    });
  } catch (error) {
    console.error('[seo_import_failed]', error);
    return NextResponse.json({ ok: false, error: 'Import failed' }, { status: 500 });
  }
}

function parseDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}
