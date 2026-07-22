-- Restore the owner-confirmed Tesla project as ANR Mechanicals' portfolio proof.
-- CodingBull's relationship remains explicitly attributed to ANR, and no
-- contract-win or lead-growth outcome is attributed to the website.
-- Exact-match guards preserve administrator-authored values that have diverged.

UPDATE "CaseStudy"
SET
  "problem" = CASE
    WHEN "problem" = 'ANR Mechanicals had substantial industrial experience but little meaningful online presence through which prospective buyers could understand the company and its work.'
      THEN 'ANR Mechanicals had no online presence despite an industrial portfolio that included a 150,000 sq ft project for Tesla in New York.'
    ELSE "problem"
  END,
  "outcomes" = CASE
    WHEN "outcomes" = 'The delivered website established a professional online presence and gave ANR Mechanicals a dedicated place to present its industrial work to prospective buyers.'
      THEN 'The delivered website established ANR Mechanicals online and gave the company a dedicated place to present major work, including its 150,000 sq ft Tesla project in New York.'
    ELSE "outcomes"
  END,
  "metrics" = CASE
    WHEN "metrics" = '[{"label":"Online Presence","value":"Established"},{"label":"Project Portfolio","value":"Published"},{"label":"Business Website","value":"Delivered"}]'::jsonb
      THEN '[{"label":"Portfolio Client","value":"Tesla"},{"label":"Project Scale","value":"150,000 sq ft"},{"label":"Project Location","value":"New York, USA"}]'::jsonb
    ELSE "metrics"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'anr-mechanical'
  AND (
    "problem" = 'ANR Mechanicals had substantial industrial experience but little meaningful online presence through which prospective buyers could understand the company and its work.'
    OR "outcomes" = 'The delivered website established a professional online presence and gave ANR Mechanicals a dedicated place to present its industrial work to prospective buyers.'
    OR "metrics" = '[{"label":"Online Presence","value":"Established"},{"label":"Project Portfolio","value":"Published"},{"label":"Business Website","value":"Delivered"}]'::jsonb
  );

UPDATE "InsightPost"
SET
  "metaDescription" = CASE
    WHEN "metaDescription" = 'A deeper case study on building ANR Mechanicals'' B2B digital presence: positioning, project storytelling, technical SEO, image performance, trust signals, and lead qualification for enterprise buyers.'
      THEN 'How we brought ANR Mechanicals online and structured its 150,000 sq ft New York project for Tesla as credible portfolio proof.'
    ELSE "metaDescription"
  END,
  "excerpt" = CASE
    WHEN "excerpt" = 'A deeper case study on building ANR Mechanicals'' B2B digital presence: positioning, project storytelling, technical SEO, image performance, trust signals, and lead qualification for enterprise buyers.'
      THEN 'How we brought ANR Mechanicals online and structured its 150,000 sq ft New York project for Tesla as credible portfolio proof.'
    ELSE "excerpt"
  END,
  "body" = REPLACE(
    REPLACE(
      REPLACE(
        "body",
        'ANR Mechanicals had completed substantial industrial and commercial work, but the company did not have a meaningful digital presence that reflected its experience. Its offline work was difficult for prospective buyers to inspect online. That gap matters for B2B companies because buyers often verify a vendor before making contact.',
        'ANR Mechanicals had no online presence despite completing substantial industrial work, including a 150,000 sq ft project for Tesla in New York. CodingBull built ANR''s website to bring that previously offline portfolio into a credible digital experience. That distinction matters: ANR completed the Tesla project; CodingBull built the website that presents ANR''s work.'
      ),
      E'## The Project Showcase\n\nThe centerpiece of the site is its industrial project showcase. We designed it to make completed work easy to inspect:\n\n1. Project context appears before decorative detail.\n2. Scope and specifications are presented in a clear sequence.\n3. High-resolution project imagery receives enough space to remain useful.\n\nThe result is a focused proof section that supports sales conversations without making unverified performance claims.',
      E'## The Tesla Project Showcase\n\nThe strongest proof point in ANR''s portfolio is its 150,000 sq ft Tesla project in New York. We gave that project a clear place in the website and designed the section to make ANR''s role and project scale easy to understand:\n\n1. Tesla is identified as ANR''s project client, not CodingBull''s direct client.\n2. The 150,000 sq ft scale and New York location are presented prominently.\n3. Project context, specifications, and imagery appear in a clear sequence.\n\nThe result is a focused proof section that showcases a major ANR achievement without claiming the website secured that contract or that Tesla engaged CodingBull.'
    ),
    'The project established ANR Mechanicals'' online presence with a dedicated website for its capabilities, project portfolio, and inquiry path. It gave the company a durable digital asset that prospective buyers can review before beginning a sales conversation.',
    'The project established ANR Mechanicals'' online presence with a dedicated website for its capabilities, project portfolio, and inquiry path. It also gave the company''s 150,000 sq ft Tesla project in New York a prominent, inspectable place in that portfolio. No contract-win or lead-growth result is attributed to the website.'
  ),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'anr-mechanicals-digital-presence'
  AND (
    "metaDescription" = 'A deeper case study on building ANR Mechanicals'' B2B digital presence: positioning, project storytelling, technical SEO, image performance, trust signals, and lead qualification for enterprise buyers.'
    OR "excerpt" = 'A deeper case study on building ANR Mechanicals'' B2B digital presence: positioning, project storytelling, technical SEO, image performance, trust signals, and lead qualification for enterprise buyers.'
    OR "body" LIKE '%ANR Mechanicals had completed substantial industrial and commercial work%'
    OR "body" LIKE '%## The Project Showcase%'
    OR "body" LIKE '%The project established ANR Mechanicals'' online presence%'
  );
