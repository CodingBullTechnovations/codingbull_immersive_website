-- Remove only the rejected healthcare outcome phrase while preserving every
-- other administrator-authored field/value in the JSON payloads.
UPDATE "ServicePage"
SET
  "hero" = replace("hero"::text, 'reducing no-shows by up to 40%', 'reducing manual scheduling and follow-up work')::jsonb,
  "painPoints" = replace("painPoints"::text, 'reducing no-shows by up to 40%', 'reducing manual scheduling and follow-up work')::jsonb,
  "modules" = replace("modules"::text, 'reducing no-shows by up to 40%', 'reducing manual scheduling and follow-up work')::jsonb,
  "faqs" = CASE
    WHEN "faqs" IS NULL THEN NULL
    ELSE replace("faqs"::text, 'reducing no-shows by up to 40%', 'reducing manual scheduling and follow-up work')::jsonb
  END,
  "body" = CASE
    WHEN "body" IS NULL THEN NULL
    ELSE replace("body", 'reducing no-shows by up to 40%', 'reducing manual scheduling and follow-up work')
  END
WHERE "slug" = 'healthcare-software-development'
  AND concat_ws(' ', "hero"::text, "painPoints"::text, "modules"::text, "faqs"::text, "body")
      ILIKE '%reducing no-shows by up to 40%';

-- Replace only the original generated metadata. A custom Admin value is kept.
UPDATE "ServicePage"
SET "metaTitle" = 'Custom Business Software Development Company'
WHERE "slug" = 'custom-business-systems'
  AND "metaTitle" = 'Custom Business Systems | CodingBull Technovations Pvt. Ltd.';

UPDATE "ServicePage"
SET "metaDescription" = 'Custom business software for CRM, approvals, portals, dashboards and workflow automation. Founder-led discovery and fixed-scope delivery by CodingBull.'
WHERE "slug" = 'custom-business-systems'
  AND "metaDescription" = 'CodingBull Technovations Pvt. Ltd. builds custom business software, internal CRMs, workflow portals, dashboards, approval systems, reporting tools, and automation layers around the way your business actually operates.';
