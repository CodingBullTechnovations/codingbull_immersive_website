-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN "visitorSessionId" TEXT;

-- CreateTable
CREATE TABLE "VisitorProfile" (
    "id" TEXT NOT NULL,
    "visitorIdHash" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "latestIpAddress" TEXT,
    "latestCountry" TEXT,
    "latestRegion" TEXT,
    "latestCity" TEXT,
    "latestDeviceType" TEXT,
    "latestBrowser" TEXT,
    "latestOs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "sessionIdHash" TEXT NOT NULL,
    "visitorIdHash" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "landingPage" TEXT,
    "lastPage" TEXT,
    "referrer" TEXT,
    "trafficChannel" "TrafficChannel" NOT NULL DEFAULT 'UNKNOWN',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "timezone" TEXT,
    "language" TEXT,
    "platform" TEXT,
    "touchEnabled" BOOLEAN,
    "colorScheme" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsRetentionReview" (
    "id" TEXT NOT NULL,
    "lastReviewedAt" TIMESTAMP(3),
    "reviewDueAfterDays" INTEGER NOT NULL DEFAULT 30,
    "dismissedUntil" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsRetentionReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorProfile_visitorIdHash_key" ON "VisitorProfile"("visitorIdHash");
CREATE INDEX "VisitorProfile_lastSeenAt_idx" ON "VisitorProfile"("lastSeenAt");
CREATE UNIQUE INDEX "VisitorSession_sessionIdHash_key" ON "VisitorSession"("sessionIdHash");
CREATE INDEX "VisitorSession_visitorIdHash_idx" ON "VisitorSession"("visitorIdHash");
CREATE INDEX "VisitorSession_ipAddress_idx" ON "VisitorSession"("ipAddress");
CREATE INDEX "VisitorSession_createdAt_idx" ON "VisitorSession"("createdAt");
CREATE INDEX "VisitorSession_lastSeenAt_idx" ON "VisitorSession"("lastSeenAt");
CREATE INDEX "VisitorSession_trafficChannel_lastSeenAt_idx" ON "VisitorSession"("trafficChannel", "lastSeenAt");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
CREATE INDEX "AnalyticsEvent_page_idx" ON "AnalyticsEvent"("page");
CREATE INDEX "AnalyticsEvent_visitorSessionId_idx" ON "AnalyticsEvent"("visitorSessionId");

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_visitorSessionId_fkey" FOREIGN KEY ("visitorSessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
