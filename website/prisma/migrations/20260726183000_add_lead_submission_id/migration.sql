ALTER TABLE "Lead" ADD COLUMN "submissionId" TEXT;

CREATE UNIQUE INDEX "Lead_submissionId_key" ON "Lead"("submissionId");
