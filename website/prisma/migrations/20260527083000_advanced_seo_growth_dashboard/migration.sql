-- CreateEnum
CREATE TYPE "SeoIndustry" AS ENUM ('HEALTHCARE', 'ECOMMERCE', 'HRMS', 'CUSTOM_DEVELOPMENT', 'GENERAL');

-- CreateEnum
CREATE TYPE "TrafficChannel" AS ENUM ('ORGANIC_SEARCH', 'AI_REFERRAL', 'DIRECT', 'REFERRAL', 'SOCIAL', 'PAID', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeoSyncProvider" AS ENUM ('SEARCH_CONSOLE', 'GA4');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "industry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';

-- Backfill lead industry from existing service interest.
UPDATE "Lead"
SET "industry" = CASE
  WHEN "serviceInterest" = 'HEALTHCARE' THEN 'HEALTHCARE'::"SeoIndustry"
  WHEN "serviceInterest" = 'ECOMMERCE' THEN 'ECOMMERCE'::"SeoIndustry"
  WHEN "serviceInterest" = 'HRMS' THEN 'HRMS'::"SeoIndustry"
  WHEN "serviceInterest" = 'CUSTOM_SYSTEMS' THEN 'CUSTOM_DEVELOPMENT'::"SeoIndustry"
  ELSE 'GENERAL'::"SeoIndustry"
END;

-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN "landingPage" TEXT;
ALTER TABLE "AnalyticsEvent" ADD COLUMN "industry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "AnalyticsEvent" ADD COLUMN "trafficChannel" "TrafficChannel" NOT NULL DEFAULT 'UNKNOWN';
ALTER TABLE "AnalyticsEvent" ADD COLUMN "visitorIdHash" TEXT;

-- AlterTable
DROP INDEX IF EXISTS "PageMetricDaily_date_page_key";
ALTER TABLE "PageMetricDaily" ADD COLUMN "industry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "PageMetricDaily" ADD COLUMN "trafficChannel" "TrafficChannel" NOT NULL DEFAULT 'UNKNOWN';

-- CreateTable
CREATE TABLE "SearchPerformanceDaily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "query" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "country" TEXT,
    "device" TEXT,
    "industry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averagePosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchPerformanceDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ga4LandingPageDaily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "landingPage" TEXT NOT NULL,
    "source" TEXT,
    "medium" TEXT,
    "trafficChannel" "TrafficChannel" NOT NULL DEFAULT 'UNKNOWN',
    "industry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL',
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "engagedSessions" INTEGER NOT NULL DEFAULT 0,
    "users" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ga4LandingPageDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSyncStatus" (
    "id" TEXT NOT NULL,
    "provider" "SeoSyncProvider" NOT NULL,
    "lastSuccessfulAt" TIMESTAMP(3),
    "lastAttemptedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "rowsImported" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoSyncStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_industry_createdAt_idx" ON "AnalyticsEvent"("industry", "createdAt");
CREATE INDEX "AnalyticsEvent_trafficChannel_createdAt_idx" ON "AnalyticsEvent"("trafficChannel", "createdAt");
CREATE INDEX "AnalyticsEvent_visitorIdHash_createdAt_idx" ON "AnalyticsEvent"("visitorIdHash", "createdAt");
CREATE UNIQUE INDEX "PageMetricDaily_date_page_industry_trafficChannel_key" ON "PageMetricDaily"("date", "page", "industry", "trafficChannel");
CREATE INDEX "PageMetricDaily_industry_date_idx" ON "PageMetricDaily"("industry", "date");
CREATE INDEX "PageMetricDaily_trafficChannel_date_idx" ON "PageMetricDaily"("trafficChannel", "date");
CREATE UNIQUE INDEX "SearchPerformanceDaily_date_query_page_country_device_key" ON "SearchPerformanceDaily"("date", "query", "page", "country", "device");
CREATE INDEX "SearchPerformanceDaily_industry_date_idx" ON "SearchPerformanceDaily"("industry", "date");
CREATE INDEX "SearchPerformanceDaily_page_date_idx" ON "SearchPerformanceDaily"("page", "date");
CREATE INDEX "SearchPerformanceDaily_query_date_idx" ON "SearchPerformanceDaily"("query", "date");
CREATE UNIQUE INDEX "Ga4LandingPageDaily_date_landingPage_source_medium_key" ON "Ga4LandingPageDaily"("date", "landingPage", "source", "medium");
CREATE INDEX "Ga4LandingPageDaily_industry_date_idx" ON "Ga4LandingPageDaily"("industry", "date");
CREATE INDEX "Ga4LandingPageDaily_trafficChannel_date_idx" ON "Ga4LandingPageDaily"("trafficChannel", "date");
CREATE UNIQUE INDEX "SeoSyncStatus_provider_key" ON "SeoSyncStatus"("provider");
