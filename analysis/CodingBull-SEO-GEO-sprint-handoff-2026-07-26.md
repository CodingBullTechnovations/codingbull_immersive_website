# CodingBull SEO/GEO implementation handoff — 2026-07-26

> ## STATUS UPDATE — 2026-07-28: ALL TECHNICAL WORK IS DEPLOYED AND VERIFIED
>
> **Owner actions 1–4 below are COMPLETE. Do not repeat them.**
>
> - **§1 Deploy — DONE.** `npm ci` → `setup:db` → `build` → `pm2 restart` all succeeded on production.
>   Three migrations applied: `add_lead_submission_id`, `add_insight_content_updated_at`,
>   `sync_reviewed_service_corrections`. The seed correctly **skipped** all existing rows
>   (9 services / 3 case studies / 12 insights / 3 testimonials; 0 created, 0 overwritten),
>   so no CMS content was clobbered. All four build guards passed. Health: `{"ok":true,"database":"ok"}`.
>   Verified live: corrected money-page title, AboutPage/Person/ContactPage schema, contact budget
>   field, de-cannibalized `/ahmedabad` title, restored timeline + 48-hour claims, and **all
>   fabricated case-study metrics and the healthcare "40%" claim are gone from production**.
> - **§2 Nginx one-hop map — DONE.** Applied to `/etc/nginx/sites-available/codingbull`
>   (map at line 1; the three `return 301` blocks now use `$codingbull_canonical_path$is_args$args`
>   instead of `$request_uri`; the `proxy_pass` www block untouched). `nginx -t` passed, reloaded.
>   **Verified externally: every legacy URL is now a single 301 and query strings survive**
>   (`/our-projects?utm_source=test` → `/case-studies?utm_source=test`). This matters because the
>   UTM destinations in §5 depend on parameter preservation.
>   Backups: `/root/nginx-backup-2026-07-28` and `sites-available/codingbull.bak-2026-07-28`.
> - **§4 Search Console — DONE.** Sitemap resubmitted; indexing requested for the six changed URLs.
>   **"Page with redirect" validation was correctly NOT re-requested** — those 16 URLs are
>   intentional redirects and will fail that validation by design, permanently. This is the
>   correct end state, not a defect.
> - **§3 GSC URL examples — NO LONGER BLOCKING.** The `Page with redirect` export was supplied and
>   analysed on 2026-07-28. All 19 URLs resolve correctly, and **every redirect destination was
>   confirmed indexed** (`/`, `/about`, `/case-studies`, `/insights`, `/privacy`,
>   `/services/custom-business-systems`). Redirect equity is landing. Nothing further to fix here.
>
> ### The one problem that remains — and it is NOT a code problem
>
> **Only 20 of 41 pages are indexed.** Not indexed: **all 12 blog posts**, 7 of 9 service pages,
> `/products`, `/terms`. These pages were tested live and are technically flawless — HTTP 200,
> `index, follow`, self-canonical, 4,200–6,600 words, present in the sitemap, not blocked by
> robots.txt. Google has crawled them and declined to index.
>
> **This is a domain-trust ceiling. No further code change will lift it.** The only lever is
> §5–§8 below: Google Business Profile, directory profiles, and genuine client reviews.
> **That work is now the entire remaining project.** See `analysis/NEXT-STEPS-OWNER-ACTIONS.md`
> for a plain-language version.

## Outcome

This sprint implements the evidence-backed repository work that can be completed without production credentials or invented business facts. It does not promise rankings, traffic, leads, local-pack placement, or AI citations.

The supplied GSC data covers 2026-06-02 through 2026-07-24: 17 clicks and 540 impressions. Its query table exposes only 2 clicks and 129 impressions because low-volume query data is omitted. The independent Queries and Pages exports cannot prove which page ranked for a query.

The Page Indexing export is scoped to **All known pages**, not sitemap URLs. Of 32 excluded URLs, 18 are redirects and 3 are alternative canonicals. The 1 redirect error, 3 duplicate-without-canonical URLs, and 7 crawled-not-indexed URLs require their exact GSC examples before URL-specific fixes are safe.

## Locked priorities

1. `/software-development-company-ahmedabad` — 48 impressions, average position 4.6, no clicks in the page export.
2. `/services/custom-business-systems` — 42 impressions, average position 12.4, no clicks in the page export.
3. `/case-studies/physioway` and `/case-studies/shashwat-ivf` — strongest owner-approved healthcare proof; production was observed serving older unsupported metrics.

The e-commerce guide was deliberately not retitled or expanded. The query-to-page relationship is unverified, and the generic inventory/order SERP is product/SaaS-led. The custom service page should own agency intent; the article should support it only after GSC ownership is verified.

## Competitor conclusion

Measured relevant pages ranged from about 570 to 3,474 visible words. CodingBull's custom-business page was already about 2,026 words. There is no evidence that “3,000 words” is a ranking rule. Competitor advantages were clearer commercial offers, price/timeline clarity, integrations, visible local/review proof, screenshots, and direct consultation paths. Prices, timelines, integrations, ratings, and client outcomes were not copied because they require CodingBull evidence and owner approval.

### Competitor evidence ledger

Checked 2026-07-26. Word counts are approximate visible words from `<main>`/`<article>`, falling back to `<body>`, with script/style/SVG/noscript removed. `UNMEASURED` means the direct response was blocked or exposed no usable main content; no count was invented. Research used current web results with location terms in the query, but exact Ahmedabad localization, mobile/desktop order, and local-pack membership were not measurable. The order below is therefore not represented as exact Google rank. No licensed competitor-traffic dataset was supplied.

| Query/intent | Three relevant result-set competitors | Measured visible words | Gap and selected business path |
|---|---|---:|---|
| `software development company in Ahmedabad` | [Raafi](https://www.raafiinfotech.com/services/custom-software-development); [Xaylon](https://xaylonlabs.com/); [LetinAI](https://www.letinaisolution.com/software-company-ahmedabad/) | 1,747; 2,430; 570 | Exact local/service relevance, entity/contact proof, process, project evidence, quote/WhatsApp paths. Upgrade `/software-development-company-ahmedabad`; do not chase a word target. |
| `custom software development company Ahmedabad` | [Raafi](https://www.raafiinfotech.com/services/custom-software-development); [Xaylon](https://xaylonlabs.com/); [LetinAI](https://www.letinaisolution.com/software-company-ahmedabad/) | 1,747; 2,430; 570 | Requirements-first language, ownership, industries, engagement process and low-friction consultation. Same commercial page owns this closely related intent. |
| `custom business software development India` | [Softwaller](https://www.softwaller.com/); [Xaylon](https://xaylonlabs.com/); [Viswambara](https://viswambara.com/) | 3,194; 2,430; 769 | Buyers get concrete CRM/ERP/inventory/HR modules, integrations, process and consultation. Add early buyer-fit/SaaS-first decision support and proof to `/services/custom-business-systems`. |
| `custom CRM development company India` | [Fruxinfo](https://www.fruxinfo.com/custom-crm-development); [Chulbul Design](https://www.chulbuldesign.com/crm-development); [Matchless Digital Hub](https://matchlessdigitalhub.com/services/crm-development) | 3,260; 1,035; UNMEASURED | Competitors publish integrations, price/timeline claims, ownership, training and migration. Keep `/services/custom-crm-development` as the owner; publish CodingBull ranges only after factual approval. |
| `clinic management software development company India` | [Developers App India](https://developersappindia.com/clinic-management-software-development); [Indiclinic](https://www.indiclinic.com/); [Clina](https://clina.in/) | 1,456; UNMEASURED; UNMEASURED | Mixed build-vs-buy intent. Development pages answer modules/security/implementation; products use trials and screenshots. Keep `/services/clinic-management-software-development` and add approved workflow evidence rather than generic scale claims. |
| `healthcare software development company India` | [PinakinVox](https://pinakinvox.com/healthcare-software-development-company); [Levitation](https://levitation.in/industry/healthcare); [Developers App India](https://developersappindia.com/clinic-management-software-development) | 2,709; 1,344; 1,456 | Operational modules, interoperability/security language and healthcare-specific consultation dominate. Keep `/services/healthcare-software-development`; do not copy unverified compliance claims. |
| `ecommerce inventory order management software` | [Finale](https://www.finaleinventory.com/features/order-management-software/); [Zoho Inventory](https://www.zoho.com/inventory/order-management-software/); [Sellercloud](https://sellercloud.com/) | UNMEASURED; UNMEASURED; UNMEASURED | Product/SaaS intent is dominant: screenshots, demos, testimonials and integration ecosystems. Do not force the blog to impersonate a product page; use `/services/inventory-order-management-software` only for custom-build qualifiers. |
| `custom ecommerce automation software` | [AspireSoftserv](https://www.aspiresoftserv.com/by-domain/ecommerce-software-development); [KSoft Technologies](https://www.ksofttechnologies.com/); [Krovz](https://krovz.com/) | 3,441; UNMEASURED; UNMEASURED | Custom ERP/WMS/OMS/integration depth and consultation paths matter. Keep `/services/ecommerce-development`; the existing guide remains supporting content until query-to-page GSC ownership is verified. Krovz exposed placeholder case studies—a credibility weakness not to copy. |

Competitor prices, timelines, scale, ratings and outcomes in those pages are self-published claims, not facts verified for CodingBull. They informed the missing buyer-decision sections; they were not copied into production content.

## Repository work completed

- One JSON redirect registry now feeds Next redirects and Proxy behavior. A generated Nginx map and redirect guard prevent drift.
- False blanket sitemap dates and synthetic case-study January 1 dates were removed. CMS dates remain data-backed; maintained static pages use explicit edit dates.
- BlogPosting freshness now uses an explicit nullable `contentUpdatedAt`; Prisma's generic `updatedAt` is never published as an editorial date. Admin saves change `contentUpdatedAt` only when title, excerpt, or body changes.
- AboutPage, Person, ContactPage, and breadcrumb schema were added using visible verified facts and the stable Organization ID.
- `/ahmedabad` is now a distinct local company hub rather than a second page targeting the same commercial H1/title.
- The two money pages have early buyer-fit/non-fit guidance, a tracked scope-review path, page-specific final CTA copy, and shorter metadata.
- Custom-business proof explicitly uses Physioway rather than misclassifying the ANR portfolio website as an internal system.
- Case-study DB rendering remains DB-first for CMS-owned fields, adds code-only enrichment the CMS does not model, omits internal missing-data labels, keeps case-specific CTAs, and rejects only the known stale metric/architecture payloads until synchronization is deployed.
- Phone and email links now emit typed events and their counts appear in Admin Analytics. AI referral classification/reporting was already present and was preserved.
- Server-side lead creation is the single owner of successful form-submit analytics and daily metrics. It hashes browser session/visitor IDs, links the conversion to `VisitorSession`/`VisitorProfile`, and uses a unique submission ID for idempotency without a duplicate client event.
- Decorative Markdown heading markers were removed from rendered text.
- The unsupported 40% no-show claim remains removed. After explicit owner confirmation on 2026-07-28, the original contact budget bands, home FAQ timeline ranges, and USA 48-working-hour response commitment were restored as approved operating facts.
- `llms.txt` now includes all static services, case studies, insights, and products; its guard is explicitly limited to the static registries and does not claim CMS-only coverage. No `llms-full.txt` was added.

## Owner actions — execute in this order

### 1. Back up and deploy the repository revision

Do not deploy until the normal database backup and rollback point exist. The production case-study pages currently appear to be on an older app/database state.

During the approved release, run the project's existing production migration step (`npm run db:deploy`) before starting the new server build. This applies the corrective case-study migration, the nullable `Lead.submissionId` and `InsightPost.contentUpdatedAt` migrations, and a targeted exact-match correction for the rejected healthcare phrase and original generated custom-business metadata. These migrations preserve administrator-authored values that do not exactly match the known stale defaults.

Do **not** use `db:seed -- --force` as part of this release: force mode intentionally replaces CMS-owned fields. The normal seed is create-only and is suitable only for adding missing starter rows; it is not the synchronization mechanism for this deployment.

After deployment, confirm the healthcare service does not contain `reducing no-shows by up to 40%`. Confirm these strings are absent from the two selected case pages: `15k`, `500+`, `45 seconds`, `35%`, `120%`, `<2min`, `80%`, `2x inquiries`, `Django API`, `WhatsApp Business`, and `used in the project architecture`.

### 2. Apply the Nginx one-hop redirect map

From `website/`, generate the reviewed file:

```bash
npm run generate:nginx-redirects
```

Use `website/deployment/nginx-legacy-redirect-map.conf` as the source. Put its `map` in Nginx's `http {}` context and merge the shown `return 301` into the existing apex TLS server block while preserving its certificate directives. Then run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Validate an ordinary apex route and legacy apex routes. Each legacy apex request should reach the final `www` URL in one redirect while preserving query strings:

```bash
curl -I 'https://codingbullz.com/blog?source=test'
curl -I 'https://codingbullz.com/custom-crm-appointment-software?source=test'
curl -I 'https://codingbullz.com/about?source=test'
```

### 3. Supply exact GSC URL examples

In Search Console → Page indexing, open each reason and export/copy the example URLs:

- Redirect error: 1 URL
- Duplicate without user-selected canonical: 3 URLs
- Crawled — currently not indexed: 7 URLs

Do not request validation before comparing each URL's live status, final destination, canonical, indexability, internal links, and sitemap membership.

Also export **Pages** after applying each query filter separately:

- `"e-commerce inventory and order" saas`
- `custom business system`
- `software company in ahmedabad`

This is required to verify query-to-page ownership. Separate unfiltered Queries and Pages CSVs cannot be joined.

### 4. Post-deploy Search Console steps

Submit `https://www.codingbullz.com/sitemap.xml` once. Inspect and request indexing only for materially changed, canonical 200 pages:

1. `https://www.codingbullz.com/software-development-company-ahmedabad`
2. `https://www.codingbullz.com/services/custom-business-systems`
3. `https://www.codingbullz.com/case-studies/physioway`
4. `https://www.codingbullz.com/case-studies/shashwat-ivf`
5. `https://www.codingbullz.com/about`
6. `https://www.codingbullz.com/contact`

Do not request indexing for redirecting legacy URLs.

### 5. Google Business Profile and directories

Use the same company name, phone, city, postal code, email, and website everywhere. Do not publish a street address unless it is eligible and intentionally public.

**GBP description**

> CodingBull Technovations Pvt. Ltd. is an Ahmedabad-based, founder-led software company building custom business systems, healthcare software, e-commerce and inventory workflows, CRM, HRMS, dashboards, admin panels, and business websites. We begin with workflow discovery, define a focused first release, and deliver scoped software around the way the business operates. Clients can discuss requirements directly with the founder through WhatsApp or a formal project brief.

**Service list**

- Custom software development
- Business process automation
- Custom CRM development
- Healthcare and clinic software development
- E-commerce development
- Inventory and order management software
- HRMS, attendance, and payroll software
- Admin panels and reporting dashboards
- Business website development

**Company profile description for Clutch, GoodFirms, TechBehemoths, and LinkedIn**

> CodingBull Technovations Pvt. Ltd. is a founder-led custom software company based in Ahmedabad, India. We build healthcare platforms, e-commerce and inventory systems, HRMS and payroll software, internal CRM, approval portals, dashboards, admin panels, workflow automation, and maintainable business websites. Our process starts with users, decisions, exceptions, data, integrations, and the first business outcome the system must support. We then define a focused scope and delivery plan instead of forcing the operation into a generic template. Published work includes a healthcare platform used by Physioway in day-to-day treatment operations, an admin-managed healthcare website for Shashwat IVF, and ANR Mechanicals' industrial portfolio website.

Recommended UTM destinations:

- GBP: `https://www.codingbullz.com/software-development-company-ahmedabad?utm_source=google&utm_medium=organic&utm_campaign=gbp_ahmedabad`
- Clutch: `https://www.codingbullz.com/services/custom-business-systems?utm_source=clutch&utm_medium=referral&utm_campaign=company_profile`
- GoodFirms: `https://www.codingbullz.com/services/custom-business-systems?utm_source=goodfirms&utm_medium=referral&utm_campaign=company_profile`
- TechBehemoths: `https://www.codingbullz.com/software-development-company-ahmedabad?utm_source=techbehemoths&utm_medium=referral&utm_campaign=company_profile`
- LinkedIn company page: `https://www.codingbullz.com/?utm_source=linkedin&utm_medium=social&utm_campaign=company_profile`

Add verified profile URLs in Admin → Social Links with `includeInSameAs` enabled. Do not put the GST number into the blank CIN field.

### 6. Client review requests

These ask for honest reviews without incentives or prescribed language.

**Physioway**

> Hi [Name], we have published a factual case study about the healthcare platform and ongoing support CodingBull provides to Physioway. If you are comfortable, would you share an honest review of your experience working with us on [chosen platform: Google/Clutch/GoodFirms]? Please describe the parts that mattered to your team in your own words. There is no incentive, and please leave out anything confidential. I can send the direct review link after you confirm.

**Shashwat IVF**

> Hi [Name], would you be comfortable leaving an honest review of CodingBull's work on the Shashwat IVF website and Django Admin content controls? Please use your own words and include only details you are permitted to make public. There is no incentive. If you agree, I will send the direct [Google/Clutch/GoodFirms] review link.

**ANR Mechanicals**

> Hi [Name], would you be comfortable leaving an honest review of CodingBull's work creating ANR Mechanicals' website and online project portfolio? Please describe your experience in your own words and omit confidential client or project information. There is no incentive. If you agree, I will send the direct review link.

### 7. Ready social posts

**Founder post — Physioway**

> Custom healthcare software starts with the treatment workflow, not the screen list. Our work with Physioway created a platform used in day-to-day treatment operations, with ongoing product and digital support. The case study explains the public facts without invented efficiency or revenue claims: https://www.codingbullz.com/case-studies/physioway?utm_source=linkedin&utm_medium=social&utm_campaign=physioway_case_study

**Company post — Shashwat IVF**

> A maintainable healthcare website should let the clinic team control routine content without waiting for a developer. For Shashwat IVF, CodingBull built a public website with Django Admin controls for blogs, media, team members, brand colours, and core page content. Read the case study: https://www.codingbullz.com/case-studies/shashwat-ivf?utm_source=linkedin&utm_medium=social&utm_campaign=shashwat_case_study

**Company post — Physioway**

> Physioway needed more than a brochure site. CodingBull created a custom healthcare platform used in day-to-day treatment operations and continues to support the product and its digital presence. The public case study separates verified operational facts from claims that have not been measured: https://www.codingbullz.com/case-studies/physioway?utm_source=linkedin&utm_medium=social&utm_campaign=physioway_case_study_company

**Founder post — Shashwat IVF**

> Content ownership is an operating requirement for a clinic website. In the Shashwat IVF project, we used Django Admin so the clinic team can manage blogs, media, team profiles, colours, and core page content without a developer for routine changes. Here is the factual implementation summary: https://www.codingbullz.com/case-studies/shashwat-ivf?utm_source=linkedin&utm_medium=social&utm_campaign=shashwat_case_study_founder

### 8. Suggested directory portfolio entries

**Physioway — Custom healthcare platform**

- Category: Healthcare software development
- Summary: Custom digital healthcare platform used by Physioway Active Health LLP in day-to-day treatment operations, with ongoing product and digital marketing support.
- Destination: `https://www.codingbullz.com/case-studies/physioway?utm_source=[directory]&utm_medium=referral&utm_campaign=physioway_portfolio`
- Evidence rule: publish no efficiency, patient-volume, revenue, or conversion metric unless the client separately approves the source evidence.

**Shashwat IVF — Admin-managed healthcare website**

- Category: Healthcare website and CMS development
- Summary: Responsive healthcare website with Django Admin controls for blogs, media, team members, colours, and core public content.
- Destination: `https://www.codingbullz.com/case-studies/shashwat-ivf?utm_source=[directory]&utm_medium=referral&utm_campaign=shashwat_portfolio`
- Evidence rule: describe delivered controls and maintainability; do not claim traffic, inquiry, response-time, or conversion improvements without measurement and permission.

## Inputs still required before further publication

- Exact GSC issue examples and query-filtered landing-page exports.
- Verified GBP URL and chosen GBP categories.
- Official directory URLs and review links.
- Exact public service prices beyond the approved contact-form qualification bands, source-code/data ownership terms, training/support terms, and named integrations.
- Founder credentials/profile URLs beyond the visible verified role.
- Client permission for new screenshots, testimonials, and measured outcomes.
- Owner-approved calendar URL if calendar booking should become a tracked CTA.
- Official CIN only if it should be public.
- Definition of a qualified lead. The implemented default is the qualification form as primary and WhatsApp as secondary; owner approval is still required before treating that as the permanent sales policy.

## Validation completed locally

- ESLint passed.
- TypeScript passed with no emit.
- Production build rendered 51 routes.
- URL/canonical guard passed for 41 public routes and 41 sitemap entries.
- Redirect registry guard passed for 17 one-hop legacy mappings.
- Static `llms.txt` coverage guard passed.
- Rendered-content guard passed for reviewed metadata, About/Contact schema, truthful article dates, healthcare claim removal, and selected case-study claim removal.
- All 12 local Prisma migrations applied successfully; the database smoke test passed with 9 services, 3 approved case studies, and 12 insights.
- Desktop checks found one H1, the expected canonical, and no horizontal overflow on both money pages and both selected case studies.
- Contact QA confirmed Service/Budget/Timeline render in three equal desktop columns and stack without horizontal overflow at 390px. The form has one H1, ContactPage/Breadcrumb schema, generated submission/session/visitor IDs, and the owner-approved budget bands.
- A real lead was not submitted during verification because that would create a lead and potentially send an external notification. The server transaction, unique idempotency migration, visitor/session linking helper, and aggregate event write were type/build verified.

## Measurement for the next two complete 28-day periods

Compare full periods only; do not judge from partial weeks.

1. GSC clicks, impressions, CTR, and average position for `/software-development-company-ahmedabad`, `/ahmedabad`, and `/services/custom-business-systems`.
2. Query-filtered landing-page ownership for the three priority queries once the required GSC exports exist.
3. Form starts, server-confirmed form submits, WhatsApp clicks, phone clicks, and email clicks by landing page and traffic channel.
4. Visitor sessions containing `FORM_SUBMIT`, so converted journeys reconcile with aggregate submits.
5. Qualified leads and won leads using the owner's definition; raw inquiry count alone is not success.
6. AI referral sessions/leads by the existing `AI_REFERRAL` channel—measured, not inferred from crawler access.

### Four-week Ahmedabad consolidation watch

The user-reported baseline for `/ahmedabad` is 90 impressions, position 4.08, and 1 click; `/software-development-company-ahmedabad` has 48 impressions at position 4.6. Watch both URLs weekly for four weeks. A short-term decline on `/ahmedabad` is possible after differentiating its title. If the money page does not inherit or grow relevant impressions by the fourth complete week, revisit the title/internal-link split using query-filtered GSC landing-page data rather than guessing.

## Completeness matrix

| Finding | Final status | Evidence/result |
|---|---|---|
| Three redirect maps | IMPLEMENTED | One JSON registry + Next/Proxy consumers + Nginx generator/guard |
| Production apex legacy routes use two hops | OWNER ACTION READY | Generated Nginx map and validation commands |
| Exact GSC redirect/duplicate/crawled URLs unknown | BLOCKED — MISSING GSC URL EXAMPLES | Export steps above |
| Blanket/synthetic sitemap dates | IMPLEMENTED | Unknown dates omitted; maintained dates explicit |
| Article `dateModified` unavailable | IMPLEMENTED | Explicit `contentUpdatedAt` migration; only material title/excerpt/body edits set it |
| About/Contact entity schema | IMPLEMENTED | AboutPage, Person, ContactPage, BreadcrumbList |
| AI-referral measurement | REJECTED WITH EVIDENCE | Already classified, stored, and shown in channel reporting |
| More AI bot directives | REJECTED WITH EVIDENCE | Wildcard access already permits public crawling |
| `llms-full.txt` | REJECTED WITH EVIDENCE | No demonstrated ranking/citation value for this sprint |
| Stale `llms.txt` links | IMPLEMENTED | Products and all static insights included; guard explicitly covers static registries only |
| 3,000-word content target | REJECTED WITH EVIDENCE | Relevant competitors measured from 570–3,474 words; CodingBull already substantial |
| Ahmedabad intent overlap | IMPLEMENTED | Local hub differentiated from commercial development page |
| Weak early money-page conversion | IMPLEMENTED | Buyer-fit briefs + tracked scope/WhatsApp paths |
| Misclassified ANR proof on custom systems | IMPLEMENTED | Explicit Physioway proof selection |
| Case-study DB proof collapse | IMPLEMENTED | Verified enrichment retained; internal missing labels removed |
| Unsupported production case metrics | OWNER ACTION READY | Correct local source/migration; deploy and verify production |
| Phone/email tracking absent | IMPLEMENTED | Reusable tracked links + Admin Analytics counts |
| Form conversion missing from visitor journeys | IMPLEMENTED | Browser IDs pass in the form, are hashed server-side, and the server event links to visitor/session records |
| Duplicate/retried form submissions | IMPLEMENTED | Unique browser-generated submission ID + additive DB migration; no heuristic email/message suppression |
| CMS `updatedAt` creates false freshness | IMPLEMENTED | Separate nullable `contentUpdatedAt`; status/SEO-only saves do not alter public freshness |
| Static copy silently overrides CMS | IMPLEMENTED | DB-first contract retained and documented; only known rejected payloads trigger narrow safety fallbacks before synchronization |
| Calendar CTA | BLOCKED — MISSING OWNER-APPROVED BOOKING URL | No URL invented |
| E-commerce article ownership | BLOCKED — MISSING QUERY-FILTERED GSC PAGES EXPORT | Article left unchanged |
| Contact budget qualification bands | IMPLEMENTED | Owner approved and restored: $1k–$2k, $2k–$3k, $3k–$5k, $5k+, and Not sure |
| Exact public service pricing/integration claims | BLOCKED — MISSING OWNER APPROVAL | No competitor claims copied; contact qualification bands are not advertised project prices |
| Previously published timeline/48-hour promises | IMPLEMENTED | Owner confirmed and restored the 4–6 / 8–16 week ranges and USA 48-working-hour response commitment |
| Permanent primary lead action | BLOCKED — MISSING OWNER SALES DECISION | Form-primary/WhatsApp-secondary is the measurable interim default |
| GBP/directory/review work | OWNER ACTION READY | Copy, URLs, and review drafts above |
