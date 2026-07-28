# Copy/paste master prompt for Claude: phase-wise CodingBull SEO, GEO and lead-generation sprint

Paste everything below into Claude and attach the GSC ZIP exports, screenshots, and repository.

---

You are replacing the previous 90-day CodingBull SEO/GEO plan. Treat this as **one continuous research-and-implementation job**, not a request for another strategy document. Work phase by phase for 3–5 working days and complete every AI-owned phase in the same task after the initial plan is approved.

Do not stop after competitor research. Do not stop after producing an execution board. Do not ask me to open a new task for implementation. Research must drive decisions, decisions must drive repository changes, and repository changes must be verified before final handoff.

Create one decision-complete sprint, clearly separated into:

1. work you will research and implement in the repository;
2. work I must complete manually because it requires accounts, business facts, client permission, or owner approval.

The sprint goal is to finish the highest-leverage changes that can improve qualified organic discovery, AI citation eligibility, local trust, and lead conversion. Do not promise ranking, traffic, leads, local-pack placement, or competitor-level performance within five days. The implementation is five days; results will be measured afterward.

## Continuous execution protocol

Follow these rules throughout the task:

1. **Inspect before planning:** read repository instructions, the existing audit/memory files, GSC exports, analytics code, sitemap, redirects, schema, content registry, relevant page components and live rendered pages.
2. **Ask once, then continue:** at the start, send one consolidated blocker request for owner-only facts or files. Do not interrupt after every phase. Continue all work that does not depend on the missing fact.
3. **Phase gates are mandatory:** do not begin implementation until Phase 1 evidence identifies the priority queries, competitors, pages and gaps. Do not finish a phase until its acceptance gate passes or the item is recorded as a genuine owner-only blocker.
4. **Every finding must close:** assign every finding exactly one final status: `IMPLEMENTED`, `OWNER ACTION READY`, `REJECTED WITH EVIDENCE`, or `BLOCKED — MISSING <specific input>`. No vague “recommended later” items.
5. **Research must map to changes:** every repository/content change must cite the query and competitor/user-data evidence behind it. Every researched gap that is not implemented must explain why.
6. **Preserve the project:** do not overwrite unrelated user changes, do not fabricate evidence, do not perform destructive Git operations and do not deploy production without explicit authorization.
7. **Prepare manual work completely:** where account access or owner identity is required, create the exact ready-to-paste profile copy, review-request messages, GBP fields, GSC URL list and verification instructions. The owner should only need to approve, log in, paste or click.
8. **Maintain a durable evidence trail:** checkpoint verified facts, decisions and progress in the repository’s existing audit/memory structure after each phase. Keep one final sprint report with sources, changes, validation and owner actions.
9. **Parallelize only safely:** if subagents are available, use them for independent SERP, code and conversion audits, but the primary agent must verify their evidence before implementation.
10. **Complete the sprint:** after the initial execution board is approved, proceed through all phases automatically. Pause only for credentials, destructive actions, production deployment or facts that would otherwise be fabricated.

## Non-negotiable evidence rules

- Do not assume that 32 non-indexed URLs are sitemap failures. The supplied Page Indexing export is scoped to **All known pages**. Eighteen are “Page with redirect” and three are “Alternative page with proper canonical,” leaving 11 URLs that need example-level diagnosis.
- Do not claim that almost all traffic is branded. The query table is privacy-truncated and contains only 129 of 540 impressions and 2 of 17 clicks.
- Do not infer a query-to-page relationship by joining independent `Queries.csv` and `Pages.csv` exports. Mark the landing page `UNVERIFIED` until I provide a query-filtered Pages export or you verify the pairing through Search Console access.
- Do not assume the redirect-error URL, the three duplicate URLs, or their causes. Use the exact GSC URL examples when supplied.
- Do not use “competitors have 3,000 words” as a ranking rule. Measure the visible main content of the actual pages ranking for each target query using one consistent extraction method. Report word count as context, not causation.
- Do not fabricate or rewrite publication dates to make content look staggered. Preserve the real publication date and add `dateModified` only after a material edit.
- Do not invent client results, ratings, reviews, team size, certifications, prices, timelines, or compliance claims. Ask me to approve facts before publishing them.
- Do not copy competitor wording, proprietary tables, or unsupported claims. Extract patterns and create original CodingBull material.
- Do not make `llms.txt`, FAQ schema, extra AI crawler rules, RSS, or OG images the center of the sprint. Google requires normal search eligibility and useful accessible content for AI features; no special AI schema or AI text file guarantees citation.
- Do not report exact competitor traffic unless you have a named Ahrefs, Semrush, Similarweb, or equivalent dataset. Public SERP visibility is not exact traffic.

## Phase 0 — Grounding, baseline and one-time owner input request

Before research or edits:

- read all repository instructions and existing audit/memory files;
- record the current Git status and preserve unrelated changes;
- inventory current routes, sitemap entries, redirect sources, schema generators, content sources, analytics events, forms and conversion paths;
- run a non-mutating baseline build/check where feasible;
- capture current titles, descriptions, canonicals, H1s, schema types, visible word counts and CTAs for the likely priority pages;
- extract the supplied GSC ZIPs at their real grain and record their date windows and privacy limitations;
- send one consolidated owner-input request using the checklist at the end of this prompt.

Create a baseline ledger before changing files. This ledger is the comparison point for the final before/after report.

**Phase-0 gate:** repository state, baseline checks, known data limits and missing owner inputs are recorded. No production content claim is assumed.

## Phase 1 — Evidence-backed competitor and Search Console research

Research current desktop and mobile Google results from Ahmedabad/India for these commercial intents:

1. `software development company in Ahmedabad`
2. `custom software development company Ahmedabad`
3. `custom business software development India`
4. `custom CRM development company India`
5. `clinic management software development company India`
6. `healthcare software development company India`
7. `ecommerce inventory order management software`
8. `custom ecommerce automation software`

For every query, record the date, locale/device, result type, top five relevant organic pages, local-pack presence, directories, and the page Google ranks. Select **three true direct competitors per intent** from the live results—not a predetermined brand list.

For each selected page, collect:

- URL, rank and page type;
- title, meta description, H1 and heading outline;
- consistently measured visible main-content word count;
- topics/sections covered and missing;
- schema types actually rendered;
- internal links and content-cluster pattern;
- pricing, timelines, process, comparison tables, proof, reviews, author identity and freshness signals;
- CTAs, forms, WhatsApp/call/calendar paths and lead-friction issues;
- directory/review/entity profiles visible from public sources;
- claims that appear unverified and therefore must not be copied.

Build a gap table comparing CodingBull with the three strongest relevant competitors. Separate:

- table stakes CodingBull lacks;
- competitor strengths CodingBull can beat with genuine evidence;
- opportunities competitors do not answer well;
- changes that affect conversion rather than ranking.

Also audit the supplied GSC exports, but explicitly show the privacy and grain limitations. Produce a short request list for any missing GSC views needed to identify query-to-page ownership.

If a licensed Ahrefs, Semrush or Similarweb export is supplied, incorporate its keyword and traffic estimates with the provider/date clearly labeled. If it is not supplied, do not pretend that paid Claude access reveals exact competitor traffic. Use public ranking visibility, query coverage and page evidence only.

Convert the research into a decision table with these columns:

| Query/intent | Current CodingBull URL | Verified ranking URL | Strongest competitors | Gap | Selected change | Expected business path |
|---|---|---|---|---|---|---|

**Phase-1 gate:** evidence ledger with source URLs, measured comparisons, three priority CodingBull URLs, and an exact reason for each selection. Do not continue with a guessed landing-page strategy. If one query-to-page pair remains unavailable, select a different verified opportunity for implementation and mark the unresolved pair as an owner action.

## Phase 2 — Lock decisions and produce the implementation board

Using only Phase-1 evidence, lock:

- the two commercial/money pages to upgrade;
- the one existing guide/query opportunity to upgrade;
- the two case studies to strengthen;
- the technical/entity defects that are confirmed;
- the lead offer and tracked conversion actions;
- the tasks to reject or defer because they lack impact or evidence.

Produce one compact board before editing:

| Work item | Evidence | AI implementation | Owner dependency | Files/surfaces | Acceptance test |
|---|---|---|---|---|---|

The default commercial pages are `/software-development-company-ahmedabad` and `/services/custom-business-systems`; change them only when Phase-1 evidence clearly supports a better choice. Do not expand all pages or all posts.

After presenting this board once for approval, proceed into Phases 3–6 without returning another plan.

**Phase-2 gate:** each planned change has a source, owner dependency and test. There are no undecided “consider doing” items.

## Phase 3 — Implement confirmed technical, indexing and entity fixes

Inspect the real repository and production responses before editing. Implement only verified issues:

- consolidate duplicated redirect definitions into one source of truth while preserving Next.js/proxy behavior;
- document or generate the corresponding production-host/Nginx mapping so an upstream two-hop redirect is not mistaken for a Next.js-only problem;
- fix exact redirect/canonical errors only when their affected URLs are known;
- replace hardcoded or false sitemap modification dates with genuine maintained values, or omit `lastmod` when no trustworthy date exists;
- add visible and structured `dateModified` only for materially updated articles;
- consolidate Organization markup around one stable entity ID and one verified `sameAs` list;
- add AboutPage/Person/ContactPage markup only where it matches visible, owner-approved content;
- verify that the existing `AI_REFERRAL` classification is surfaced in reporting instead of rebuilding the classifier;
- keep the concise `llms.txt` synchronized mechanically if this is low-risk, but do not build `llms-full.txt` in this sprint.

Also produce exact owner-ready outputs for technical actions Claude cannot perform directly:

- the precise Nginx mapping/config diff or command sequence, clearly marked for owner/VPS approval;
- the exact GSC issue URL checklist and the expected result for each URL;
- the exact sitemap submission and priority URL-inspection list after deployment.

**Phase-3 gate:** build passes; canonical/sitemap guard passes; changed structured data is present in rendered HTML; production redirect targets are documented; no fake dates or identity data are introduced. Each confirmed technical issue is implemented or has an executable owner-only instruction.

## Phase 4 — Implement two high-intent money pages and the lead journey

Default candidates are:

- `/software-development-company-ahmedabad`
- `/services/custom-business-systems`

Change a candidate only if Phase-1 evidence identifies a clearly higher-value commercial page.

For each page, create original, server-rendered content that answers the buying decision early:

- direct answer beneath the H1: who it is for, what CodingBull builds, and the next action;
- buyer fit and non-fit;
- modules/workflows and integration boundaries;
- discovery-to-launch process;
- realistic timeline and budget-driver framework; publish exact ranges only after my approval;
- build-vs-buy or custom-vs-SaaS comparison;
- common failure modes and CodingBull’s controls;
- relevant case-study evidence and screenshots/diagrams where approved;
- founder/author identity and genuine update date;
- concise buyer FAQs in visible HTML where they remove sales objections;
- one strong primary CTA and one secondary WhatsApp/contact path;
- contextual internal links to one case study, one supporting guide and the relevant service/location parent.

Implement the complete commercial journey, not isolated copy:

- align the primary offer across the two pages and relevant contact surface;
- reuse existing form/CTA components rather than duplicating them;
- add or verify qualification fields for the business problem, required system, timeline and an owner-approved budget-band model;
- track form start/submit, WhatsApp, phone, email and calendar actions in the existing analytics architecture;
- put approved trust evidence beside the decision CTA;
- verify success/error states, mobile usability, privacy wording and spam protection.

Do not target an arbitrary word count. Use the competitor median and section-gap analysis to decide the minimum complete length. Report the before/after word count and, more importantly, the new decision sections and proof added.

**Phase-4 gate:** both pages have unique search intent, no keyword cannibalization, verifiable proof, a complete tracked conversion path, matching metadata/schema and no unsupported superlatives. Form and contact actions work on mobile and desktop.

## Phase 5 — Implement one verified query opportunity and two case studies

Select one existing article only after query-to-page ownership is verified. If the e-commerce query’s landing page is still unknown, do not retitle or redirect content to force ownership. Instead, strengthen the page that already matches the verified intent.

Add an original answer summary, decision table, modules, cost/timeline drivers, failure modes, first-party experience, author information, citations to authoritative sources where necessary, and internal links to the commercial page and proof.

Upgrade the two strongest case studies using only owner-approved evidence:

- problem and baseline;
- users and workflows;
- modules and technical constraints;
- architecture/implementation decisions;
- permissioned screenshots or diagrams;
- qualitative outcomes when measured numbers are unavailable;
- measured outcomes only when the evidence and client permission are supplied;
- named author, genuine dates and relevant service links.

Use truthful schema. Do not change `CreativeWork` to `Article` merely because another plan recommended it.

For owner-only off-page work, create finished assets during this phase:

- one approved-length Google Business Profile description and service list;
- consistent company descriptions for Clutch, GoodFirms, TechBehemoths and LinkedIn;
- suggested portfolio entries linked to the two selected case studies;
- three personalized review-request drafts for approved clients, with no incentives or prescribed review wording;
- one founder LinkedIn post and one company post for each upgraded guide/case study;
- UTM-tagged destination recommendations for GBP and directory profiles.

Do not create accounts, publish external profiles, contact clients or post publicly without owner authorization.

**Phase-5 gate:** one query-aligned guide and two evidence-rich case studies render correctly and create a clear guide → service → proof → contact journey. Every selected off-page manual action has ready-to-paste copy and exact destination instructions.

## Phase 6 — Full verification, hostile review and handoff

Re-verify the conversion path implemented in Phase 4 without redesigning the entire site:

- one consistent primary offer, preferably an owner-approved “Book a software scoping call” or equivalent;
- short qualification fields covering business problem, required system, budget band and timeline;
- tracked form start/submit, WhatsApp, email, phone and calendar events;
- UTM-tagged GBP website link recommendation;
- visible trust beside high-intent CTAs: approved case proof, founder access, response expectation and privacy reassurance;
- verify mobile CTA/form behavior and remove avoidable friction.

Run:

- lint and TypeScript checks;
- production build and the URL/canonical guard;
- redirect matrix checks;
- rendered metadata and JSON-LD inspection;
- schema.org/Google validation where applicable;
- mobile and desktop rendering checks;
- form/WhatsApp/contact and analytics-event smoke tests;
- before/after comparison for the three optimized pages.

Produce a final report containing:

1. competitor evidence and sources;
2. every repository change and its business/search reason;
3. AI-completed work;
4. manual owner tasks still outstanding;
5. validation results;
6. the baseline metrics to watch for the next two complete 28-day periods.

Before the final report, re-read the complete diff as a hostile reviewer. Check for invented facts, accidental keyword cannibalization, duplicated utilities/components, schema that does not match visible content, false modification dates, broken responsive layouts, untracked CTA paths and changes unrelated to the sprint.

The final completeness matrix must list every Phase-1 finding and one of these statuses:

| Finding | Evidence | Final status | Implementation/owner asset | Verification |
|---|---|---|---|---|

Allowed statuses are only `IMPLEMENTED`, `OWNER ACTION READY`, `REJECTED WITH EVIDENCE`, and `BLOCKED — MISSING <specific input>`.

**Phase-6 gate:** all automated checks and browser smoke tests pass, the completeness matrix contains every finding, owner tasks are ready to execute, and no AI-owned work remains as an unimplemented recommendation.

## Work only I can do manually

Place these in a separate checklist. Ask for them once during Phase 0, continue independent work, and prepare exact owner-ready assets where possible:

- export GSC example URLs for the redirect error, duplicate and crawled-not-indexed groups;
- export query-filtered Pages results for the priority queries;
- provide the verified Google Business Profile URL, categories and performance export;
- approve or create Clutch, GoodFirms, TechBehemoths and LinkedIn profiles;
- request genuine client reviews—no incentives or templated duplicate wording;
- supply the official CIN only if it should be public;
- approve prices, timelines, founder credentials, client names, testimonials, screenshots and metrics;
- define a qualified lead and the preferred primary CTA;
- approve and deploy production changes, then resubmit the sitemap and request indexing for only the materially improved priority URLs.

## Required response and execution format

First replace the prior plan with a compact phase board:

| Phase | AI work | Owner/manual work | Deliverable | Acceptance gate |
|---|---|---|---|---|

Then include:

- the three selected priority pages;
- the competitor evidence table;
- an explicit `DO NOW / DEFER / REJECT` list;
- a blocker list containing only information you genuinely cannot discover;
- no 90-day calendar and no generic SEO checklist.

After the phase board is approved, implement Phases 0–6 in the same task. At each gate, post a short evidence-based progress update and continue. Do not return another strategy essay and do not leave AI-owned recommendations unimplemented.

---

## Owner preparation checklist

Prepare these while Claude runs Phase 1:

1. GSC example URLs for the 1 redirect error, 3 duplicates and 7 crawled-not-indexed URLs.
2. Query-filtered Pages exports for the priority queries.
3. Google Business Profile URL, categories, review count and performance export.
4. Official LinkedIn, Instagram, GitHub and directory profile URLs.
5. Approved project budget/timeline ranges that CodingBull is willing to publish.
6. Client permission for case-study names, screenshots, testimonials and metrics.
7. Your preferred lead action: call booking, WhatsApp or qualification form.
8. A definition of a qualified lead.
