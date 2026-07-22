-- Keep the CMS-first ANR article aligned with the corrected static source even
-- when a deployment applies migrations without immediately running the seed.
-- Each replacement requires the exact original seeded text, preserving any
-- administrator-authored variation.

UPDATE "InsightPost"
SET
  "body" = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            "body",
            'ANR Mechanicals had completed large industrial and commercial projects, including a 150,000 sqft Tesla facility, but the company did not have a digital presence that reflected that scale. Their offline reputation was stronger than their search visibility. That gap matters for B2B companies because buyers often verify a vendor online before making contact.',
            'ANR Mechanicals had completed substantial industrial and commercial work, but the company did not have a meaningful digital presence that reflected its experience. Its offline work was difficult for prospective buyers to inspect online. That gap matters for B2B companies because buyers often verify a vendor before making contact.'
          ),
          '## The Tesla Project Showcase',
          '## The Project Showcase'
        ),
        'The centerpiece of the site is the Tesla project section. We designed it as a scroll-driven reveal:',
        'The centerpiece of the site is its industrial project showcase. We designed it to make completed work easy to inspect:'
      ),
      E'1. The 150,000 sqft number animates in as the user scrolls\n2. Project details (scope, timeline, specifications) appear sequentially\n3. High-resolution imagery fills the viewport\n\nThis single section has generated more inbound inquiries than anything else on the site.',
      E'1. Project context appears before decorative detail.\n2. Scope and specifications are presented in a clear sequence.\n3. High-resolution project imagery receives enough space to remain useful.\n\nThe result is a focused proof section that supports sales conversations without making unverified performance claims.'
    ),
    E'## Results\n\nWithin 6 months:\n\n- **First page Google ranking** for "mechanical contractor Ahmedabad".\n- **3x increase** in inbound project inquiries.\n- **Enterprise clients** reaching out after seeing the Tesla project showcase.\n\n## Tactical Architecture & Internal Systems\n\nTo protect proprietary operating advantages, certain mission-critical backend tools such as project tracking and vendor management systems remain internal. However, the public-facing platform shows how a traditional industrial company can modernize its lead qualification, search presence, and buyer trust without changing the substance of its work.',
    E'## Delivered result\n\nThe project established ANR Mechanicals'' online presence with a dedicated website for its capabilities, project portfolio, and inquiry path. It gave the company a durable digital asset that prospective buyers can review before beginning a sales conversation.\n\n## Tactical Architecture & Internal Systems\n\nThe public-facing platform shows how an established industrial company can make its capabilities and completed work easier to inspect without changing the substance of the business.'
  ),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'anr-mechanicals-digital-presence'
  AND (
    "body" LIKE '%150,000 sqft Tesla facility%'
    OR "body" LIKE '%## The Tesla Project Showcase%'
    OR "body" LIKE '%**3x increase** in inbound project inquiries%'
  );
