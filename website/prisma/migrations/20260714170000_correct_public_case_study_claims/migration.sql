-- Replace only the original seeded claims. If an administrator has already
-- edited any field, its non-matching value is preserved.

UPDATE "CaseStudy"
SET
  "title" = CASE
    WHEN "title" = 'Multi-Branch Clinic Management & Analytics'
      THEN 'Healthcare Treatment & Digital Platform'
    ELSE "title"
  END,
  "problem" = CASE
    WHEN "problem" = 'Physioway struggled with fragmented patient records across multiple branches, manual attendance tracking for therapists, and an opaque sales pipeline leading to high lead leakage.'
      THEN 'Physioway Active Health LLP needed a custom digital platform that could support its day-to-day treatment work and provide a maintainable foundation for its online presence.'
    ELSE "problem"
  END,
  "solution" = CASE
    WHEN "solution" = 'We architected a custom Django-powered clinic management system with a real-time availability engine, automated PDF payroll generation for 50+ staff, and an integrated CRM for patient journey tracking.'
      THEN 'We created Physioways.com as a custom healthcare platform for Physioway Active Health LLP and continue to support the organization through product work and digital marketing.'
    ELSE "solution"
  END,
  "outcomes" = CASE
    WHEN "outcomes" = 'Successful deployment across 4 branches, reducing payroll processing time from 3 days to 45 seconds and increasing patient follow-up efficiency by 35%.'
      THEN 'Physioway uses the delivered platform in its day-to-day treatment operations, while CodingBull continues to support its digital presence and marketing.'
    ELSE "outcomes"
  END,
  "metrics" = CASE
    WHEN "metrics" = '[{"label":"Patient Records","value":"15k+"},{"label":"Daily Interactions","value":"500+"},{"label":"Branches","value":"4"}]'::jsonb
      THEN '[{"label":"Platform","value":"Physioways.com"},{"label":"Operational Use","value":"Day-to-day"},{"label":"Ongoing Support","value":"Product + marketing"}]'::jsonb
    ELSE "metrics"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'physioway'
  AND (
    "title" = 'Multi-Branch Clinic Management & Analytics'
    OR "problem" = 'Physioway struggled with fragmented patient records across multiple branches, manual attendance tracking for therapists, and an opaque sales pipeline leading to high lead leakage.'
    OR "solution" = 'We architected a custom Django-powered clinic management system with a real-time availability engine, automated PDF payroll generation for 50+ staff, and an integrated CRM for patient journey tracking.'
    OR "outcomes" = 'Successful deployment across 4 branches, reducing payroll processing time from 3 days to 45 seconds and increasing patient follow-up efficiency by 35%.'
    OR "metrics" = '[{"label":"Patient Records","value":"15k+"},{"label":"Daily Interactions","value":"500+"},{"label":"Branches","value":"4"}]'::jsonb
  );

UPDATE "CaseStudy"
SET
  "title" = CASE
    WHEN "title" = 'High-Conversion Healthcare Lead Generation'
      THEN 'Admin-Managed Healthcare Website'
    ELSE "title"
  END,
  "problem" = CASE
    WHEN "problem" = 'Shashwat IVF needed a premium digital presence that captured the trust of prospective patients while automating their booking flow and reducing phone-call burden on staff.'
      THEN 'Shashwat IVF needed a professional healthcare website that its own team could keep current without relying on developers for routine content and visual updates.'
    ELSE "problem"
  END,
  "solution" = CASE
    WHEN "solution" = 'Designed and engineered an immersive, high-performance website with real-time slot booking and an automated WhatsApp notification engine for appointments and reminders.'
      THEN 'We created a healthcare website backed by Django Admin, giving the team control over blogs, colors, images, team members, and other core website content.'
    ELSE "solution"
  END,
  "outcomes" = CASE
    WHEN "outcomes" = 'Significant reduction in manual booking errors and a 2x increase in qualified online patient inquiries within the first 6 months.'
      THEN 'The delivered website gives Shashwat IVF a maintainable online presence and lets its team manage most public content directly through Django Admin.'
    ELSE "outcomes"
  END,
  "metrics" = CASE
    WHEN "metrics" = '[{"label":"Lead Growth","value":"120%"},{"label":"Booking Speed","value":"<2min"},{"label":"Automation","value":"80%"}]'::jsonb
      THEN '[{"label":"Content Backend","value":"Django Admin"},{"label":"Publishing","value":"Team-managed"},{"label":"Editable Areas","value":"Site-wide"}]'::jsonb
    ELSE "metrics"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'shashwat-ivf'
  AND (
    "title" = 'High-Conversion Healthcare Lead Generation'
    OR "problem" = 'Shashwat IVF needed a premium digital presence that captured the trust of prospective patients while automating their booking flow and reducing phone-call burden on staff.'
    OR "solution" = 'Designed and engineered an immersive, high-performance website with real-time slot booking and an automated WhatsApp notification engine for appointments and reminders.'
    OR "outcomes" = 'Significant reduction in manual booking errors and a 2x increase in qualified online patient inquiries within the first 6 months.'
    OR "metrics" = '[{"label":"Lead Growth","value":"120%"},{"label":"Booking Speed","value":"<2min"},{"label":"Automation","value":"80%"}]'::jsonb
  );

UPDATE "CaseStudy"
SET
  "title" = CASE
    WHEN "title" = 'Industrial Portfolio for Enterprise Tenders'
      THEN 'Industrial Portfolio & Online Presence'
    ELSE "title"
  END,
  "problem" = CASE
    WHEN "problem" = 'ANR Mechanicals had no digital proof of their massive scale (like the 150,000 sqft Tesla facility), making it difficult to win high-end tenders against digitally-savvy competitors.'
      THEN 'ANR Mechanicals had substantial industrial experience but little meaningful online presence through which prospective buyers could understand the company and its work.'
    ELSE "problem"
  END,
  "solution" = CASE
    WHEN "solution" = 'Built a cinematic, high-impact portfolio showcased their engineering precision through interactive project modules and high-resolution industrial documentation.'
      THEN 'We built a focused industrial website that presents ANR Mechanicals, its capabilities, and its project portfolio through a clear, modern digital experience.'
    ELSE "solution"
  END,
  "outcomes" = CASE
    WHEN "outcomes" = 'Transformed their sales process, enabling their team to present their scale to enterprise boards and securing bigger contracts using the digital portfolio.'
      THEN 'The delivered website established a professional online presence and gave ANR Mechanicals a dedicated place to present its industrial work to prospective buyers.'
    ELSE "outcomes"
  END,
  "metrics" = CASE
    WHEN "metrics" = '[{"label":"Tesla Facility","value":"150k sqft"},{"label":"Contracts Won","value":"+3"},{"label":"Brand Value","value":"High"}]'::jsonb
      THEN '[{"label":"Online Presence","value":"Established"},{"label":"Project Portfolio","value":"Published"},{"label":"Business Website","value":"Delivered"}]'::jsonb
    ELSE "metrics"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'anr-mechanical'
  AND (
    "title" = 'Industrial Portfolio for Enterprise Tenders'
    OR "problem" = 'ANR Mechanicals had no digital proof of their massive scale (like the 150,000 sqft Tesla facility), making it difficult to win high-end tenders against digitally-savvy competitors.'
    OR "solution" = 'Built a cinematic, high-impact portfolio showcased their engineering precision through interactive project modules and high-resolution industrial documentation.'
    OR "outcomes" = 'Transformed their sales process, enabling their team to present their scale to enterprise boards and securing bigger contracts using the digital portfolio.'
    OR "metrics" = '[{"label":"Tesla Facility","value":"150k sqft"},{"label":"Contracts Won","value":"+3"},{"label":"Brand Value","value":"High"}]'::jsonb
  );
