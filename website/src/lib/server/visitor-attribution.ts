import type { Prisma, TrafficChannel } from '@prisma/client';

interface VisitorAttributionInput {
  sessionIdHash?: string | null;
  visitorIdHash?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  landingPage?: string | null;
  page: string;
  referrer?: string | null;
  trafficChannel: TrafficChannel;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device?: {
    deviceType?: string;
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
  };
  clientContext?: {
    screenWidth?: number;
    screenHeight?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    timezone?: string;
    language?: string;
    platform?: string;
    touchEnabled?: boolean;
    colorScheme?: string;
  };
}

/**
 * Link an analytics event to the same visitor/session graph used by the
 * browser events route. Both normal events and server-confirmed conversions
 * must call this helper so journey reports cannot drift from aggregate counts.
 */
export async function upsertVisitorAttribution(
  tx: Prisma.TransactionClient,
  input: VisitorAttributionInput,
) {
  const { sessionIdHash, visitorIdHash } = input;
  if (!sessionIdHash || !visitorIdHash) return null;

  const existingSession = await tx.visitorSession.findUnique({
    where: { sessionIdHash },
    select: { id: true },
  });
  const device = input.device ?? {};
  const clientContext = input.clientContext ?? {};
  const now = new Date();

  const visitorProfile = await tx.visitorProfile.upsert({
    where: { visitorIdHash },
    create: {
      visitorIdHash,
      firstSeenAt: now,
      lastSeenAt: now,
      totalSessions: existingSession ? 0 : 1,
      totalEvents: 1,
      latestIpAddress: input.ipAddress,
      latestCountry: input.country,
      latestRegion: input.region,
      latestCity: input.city,
      latestDeviceType: device.deviceType,
      latestBrowser: device.browser,
      latestOs: device.os,
    },
    update: {
      lastSeenAt: now,
      totalSessions: existingSession ? undefined : { increment: 1 },
      totalEvents: { increment: 1 },
      latestIpAddress: input.ipAddress ?? undefined,
      latestCountry: input.country ?? undefined,
      latestRegion: input.region ?? undefined,
      latestCity: input.city ?? undefined,
      latestDeviceType: device.deviceType,
      latestBrowser: device.browser,
      latestOs: device.os,
    },
  });

  const visitorSession = await tx.visitorSession.upsert({
    where: { sessionIdHash },
    create: {
      sessionIdHash,
      visitorIdHash,
      visitorId: visitorProfile.id,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      country: input.country,
      region: input.region,
      city: input.city,
      landingPage: input.landingPage,
      lastPage: input.page,
      referrer: input.referrer,
      trafficChannel: input.trafficChannel,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      ...device,
      ...clientContext,
      firstSeenAt: now,
      lastSeenAt: now,
      eventCount: 1,
    },
    update: {
      lastPage: input.page,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      country: input.country ?? undefined,
      region: input.region ?? undefined,
      city: input.city ?? undefined,
      trafficChannel: input.trafficChannel,
      ...device,
      screenWidth: clientContext.screenWidth ?? undefined,
      screenHeight: clientContext.screenHeight ?? undefined,
      viewportWidth: clientContext.viewportWidth ?? undefined,
      viewportHeight: clientContext.viewportHeight ?? undefined,
      timezone: clientContext.timezone ?? undefined,
      language: clientContext.language ?? undefined,
      platform: clientContext.platform ?? undefined,
      touchEnabled: clientContext.touchEnabled ?? undefined,
      colorScheme: clientContext.colorScheme ?? undefined,
      lastSeenAt: now,
      eventCount: { increment: 1 },
    },
  });

  return visitorSession.id;
}
