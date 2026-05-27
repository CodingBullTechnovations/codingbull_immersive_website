-- CreateEnum
CREATE TYPE "CredentialProvider" AS ENUM ('GOOGLE', 'GA4', 'SEARCH_CONSOLE', 'EMAIL', 'SITE');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('UNKNOWN', 'VERIFIED', 'ERROR');

-- AlterTable
ALTER TABLE "ServicePage" ADD COLUMN "seoPrimaryKeyword" TEXT;
ALTER TABLE "ServicePage" ADD COLUMN "seoSecondaryKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "ServicePage" ADD COLUMN "seoSearchIntent" TEXT;
ALTER TABLE "ServicePage" ADD COLUMN "seoFunnelStage" TEXT;
ALTER TABLE "ServicePage" ADD COLUMN "seoIndustry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "ServicePage" ADD COLUMN "canonicalPath" TEXT;
ALTER TABLE "ServicePage" ADD COLUMN "internalLinkTargets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN "seoPrimaryKeyword" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN "seoSecondaryKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "CaseStudy" ADD COLUMN "seoSearchIntent" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN "seoFunnelStage" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN "seoIndustry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "CaseStudy" ADD COLUMN "canonicalPath" TEXT;
ALTER TABLE "CaseStudy" ADD COLUMN "internalLinkTargets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "InsightPost" ADD COLUMN "seoPrimaryKeyword" TEXT;
ALTER TABLE "InsightPost" ADD COLUMN "seoSecondaryKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "InsightPost" ADD COLUMN "seoSearchIntent" TEXT;
ALTER TABLE "InsightPost" ADD COLUMN "seoFunnelStage" TEXT;
ALTER TABLE "InsightPost" ADD COLUMN "seoIndustry" "SeoIndustry" NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "InsightPost" ADD COLUMN "canonicalPath" TEXT;
ALTER TABLE "InsightPost" ADD COLUMN "internalLinkTargets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "IntegrationCredential" (
    "id" TEXT NOT NULL,
    "provider" "CredentialProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "maskedValue" TEXT,
    "status" "CredentialStatus" NOT NULL DEFAULT 'UNKNOWN',
    "lastVerifiedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationCredential_provider_key_key" ON "IntegrationCredential"("provider", "key");
CREATE INDEX "IntegrationCredential_provider_idx" ON "IntegrationCredential"("provider");
CREATE UNIQUE INDEX "Testimonial_person_company_key" ON "Testimonial"("person", "company");
