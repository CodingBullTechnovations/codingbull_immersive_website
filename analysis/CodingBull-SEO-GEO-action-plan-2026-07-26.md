# CodingBull SEO, GEO, and AI-readability decision plan

**Assessment date:** 2026-07-26  
**Data window:** GSC performance 2026-06-02–2026-07-24; page indexing through 2026-07-10  
**Decision:** Do not execute the submitted plan as written. Keep its emphasis on technical hygiene, proof-led content, local/entity authority, and measurement, but change the diagnosis, sequence, and several tactics.

## Executive verdict

The proposed plan is approximately **60% directionally right and 40% unsupported, overstated, or low priority**.

The real situation is:

1. **There is bounded indexing and redirect cleanup, not evidence of a 32-page indexing crisis.** The coverage export is scoped to “All known pages,” not the submitted sitemap. Of 32 non-indexed URLs, 18 are redirects and 3 are alternative canonical pages. Those 21 are usually expected exclusions. The 11 URLs that need URL-level diagnosis are 1 redirect error, 3 duplicates, and 7 crawled-but-not-indexed URLs.
2. **The available query data cannot establish branded share.** The query table contains only 129 of 540 impressions and 2 of 17 clicks. Google omits anonymized queries from the table while keeping them in chart totals. “Almost all traffic is branded” is therefore not supported.
3. **The export cannot connect a query to a landing page.** `Queries.csv` and `Pages.csv` are independent dimensions. The claim that `/insights` ranks for the quoted e-commerce query is unverified until GSC is filtered by that query and the Pages tab is exported.
4. **Technical SEO is not the main growth bottleneck, but it is not finished.** The site has server-rendered pages, canonicals, structured data, a sitemap, robots rules, and a build guard. However, redirects are duplicated in three code locations, live apex legacy URLs take two hops, static sitemap dates are hardcoded, and article markup lacks genuine `dateModified` data.
5. **The main growth gap is authority and proof.** A localized Ahmedabad SERP review showed a review-heavy local pack first, GoodFirms as the first organic result, followed by local company pages, list pages, Clutch, and other providers. Competitors that answer buying questions well show real offices, reviews, scale evidence, pricing bands, delivery processes, and detailed service coverage.

## Autopsy of the submitted plan

| Proposed item | Decision | Why |
|---|---|---|
| Fix the exact redirect error and duplicates | **Keep, after URL evidence** | Correct priority, but the supplied export does not include example URLs. Do not guess the affected pages. |
| Make every redirect one hop | **Keep, modify scope** | Live apex legacy paths currently go apex → same path on `www` → final path. Consolidating TypeScript maps alone will not change the upstream/Nginx hop. |
| Consolidate three redirect maps | **Keep** | Good engineering hygiene and prevents drift. The production host redirect configuration also needs a matching source or generated map. |
| Treat 32 non-indexed URLs as sitemap debt | **Reject** | The export says “All known pages.” Twenty-one URLs are redirects or alternate canonicals, not necessarily defects. |
| Request indexing for all posts | **Modify** | Improve and inspect the seven exact crawled-not-indexed examples first. Request indexing only for a small set of important, materially improved canonical URLs. |
| Add accurate `dateModified` | **Keep** | Use a maintained `updatedAt` only after material edits. For static pages without trustworthy dates, omit `lastmod` rather than emitting a fake date. |
| Add FAQ schema to every blog | **Reject as a blanket rule** | Visible buyer questions can help readers and retrieval, but Google restricts FAQ rich results mainly to authoritative government and health sites. Schema is not CodingBull’s “biggest AEO gap.” |
| About/Person/Contact schema | **Keep as support work** | Useful entity hygiene when the founder identity and profiles are real, but not a primary ranking lever. The current About page is already founder-led; improve rather than rebuild blindly. |
| Fill `Organization.sameAs` | **Keep, verify first** | Live homepage markup currently exposes Instagram in one Organization object and an empty `sameAs` in another. Consolidate the entity graph and add only official profiles. |
| Upgrade case studies to `Article` | **Modify** | First improve proof, authorship, dates, screenshots, and verified metrics. `CreativeWork` is not inherently wrong; use `Article` only when the page is genuinely editorial. |
| Auto-generate `llms.txt` | **Keep as low-effort maintenance** | The current file is stale relative to the sitemap. Automation prevents drift, but it is not a citation-growth strategy. |
| Add `llms-full.txt` | **Defer** | High duplication and maintenance cost with no demonstrated ranking or citation benefit. |
| Add more explicit AI crawler allow rules | **Drop** | The wildcard rule already allows unspecified crawlers. Adding redundant allow groups changes no access behavior. |
| Add RSS | **Defer** | Useful only if CodingBull will syndicate content or support subscribers. Google can accept RSS as a sitemap for recent URLs, but it is not a ranking lever. |
| Per-section OG images | **Defer** | Valuable for active social distribution and click presentation, not a search-ranking priority. |
| Expand posts to 1,500–3,000 words | **Replace with intent completeness** | Word count is not the goal. Add decision-useful proof, costs, timelines, failure modes, diagrams, comparisons, and first-party examples only where they answer the query. |
| Publish 1–2 posts every week | **Reject for now** | At current authority, two generic posts per week create more indexing inventory without solving proof or distribution. Prefer one strong page every two weeks plus distribution. |
| Create a Google Business Profile | **Modify** | The owner has indicated a profile exists. Fully optimize the existing profile; do not create a duplicate. |
| Directory profiles and genuine reviews | **Keep, high priority** | Strong match to the current local/directory SERP and entity-validation needs. Avoid low-quality bulk directory submissions. |
| Add AI referral segmentation | **Already implemented** | The code already classifies ChatGPT, OpenAI, Perplexity, Gemini/Bard, Claude, Poe, and Copilot referrers as `AI_REFERRAL`. Verify dashboard reporting instead of rebuilding classification. |

Google’s current documentation says AI Overviews and AI Mode require no special AI schema or machine-readable file; normal indexing, useful text, internal linking, page experience, matching structured data, and an up-to-date Business Profile remain the foundations. See [Google’s AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) and [FAQ rich-result limitations](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

## What competitors are actually doing better

The current search landscape is not accurately described as “directories dominate and big Ahmedabad software brands publish 3,000-word guides.” It is a mixed local-intent SERP.

- **Local pack winners:** large volumes of genuine reviews, complete local identity, physical/service-area relevance, hours, phone, and strong business profiles.
- **GoodFirms and Clutch:** comparison inventory, reviews, category authority, and many provider entities. They validate firms for both buyers and machine systems.
- **Relevant local providers:** exact-intent pages with real addresses, review proof, transparent price ranges, service comparisons, delivery process, FAQs, and response-time claims. [Insta Biz Web’s Ahmedabad page](https://www.instabizweb.com/software-development-company-in-ahmedabad) is a direct example.
- **Broader custom-software competitors:** extensive service/industry taxonomies, delivery scale, project counts, team proof, pricing ranges, processes, and hiring models. [Xaylon Labs](https://xaylonlabs.com/) is one current example.

CodingBull does not need to imitate every element. It should beat competitors on **specificity and credibility**: show how systems are scoped, what modules cost, what can go wrong, what was actually built, and what measurable operational result followed.

## Revised 90-day plan

### Days 1–7: establish the truth and fix only confirmed technical issues

**Owner: engineering + site owner**

1. Export example URLs from GSC for:
   - Redirect error (1)
   - Duplicate without user-selected canonical (3)
   - Crawled – currently not indexed (7)
2. For the five opportunity queries, filter each query in GSC and export the Pages tab. At minimum:
   - `"e-commerce inventory and order" saas`
   - `custom business system`
   - `software company in ahmedabad`
   - `codebulls`
   - the strongest healthcare/custom-software non-brand query visible after filtering
3. Export the last 28 days versus previous 28 days with query and page filters. The current “three months” file contains only 53 days, so it is not a reliable three-month trend comparison.
4. Fix the exact redirect error and three exact duplicate cases once known.
5. Consolidate redirect rules into one checked-in source and generate or mirror the production host/Nginx map from it. Test old apex URLs to ensure a single permanent hop where operationally practical.
6. Replace fake static sitemap modification dates with maintained per-page values. If a static page has no trustworthy update date, omit `lastmod`. Google says it uses `lastmod` only when it is consistently accurate and ignores `priority` and `changefreq`; see [Google’s sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
7. Add `dateModified` to article schema and the visible article header only when a material content edit occurred. Preserve the real original publication date.

**Exit criteria:** the 11 actionable coverage URLs are classified individually; no unresolved redirect loop/error remains; all important canonical URLs return 200; legacy URLs have documented final destinations.

### Days 8–21: local and entity authority—the highest-leverage work

**Owner: founder/site owner, supported by engineering**

1. Optimize the existing Google Business Profile:
   - correct primary and secondary categories;
   - services and service descriptions;
   - consistent company name, phone, hours, and website URL with UTM tracking;
   - current photos, logo, projects, and periodic posts;
   - service area/address configuration that follows Google’s eligibility rules.
2. Ask genuine clients for reviews gradually. Start with completed, permissioned relationships. Do not script identical reviews or offer incentives.
3. Complete only authoritative profiles first: GoodFirms, Clutch, TechBehemoths, LinkedIn company page, founder LinkedIn, and GitHub if it represents public company work.
4. Consolidate Organization schema so there is one stable entity ID with one accurate `sameAs` list. Add only official identity-equivalent profiles.
5. Improve the About page rather than rebuilding it from zero:
   - founder’s real role, experience, and profile links;
   - why the company exists;
   - delivery principles and decision process;
   - verifiable client/project proof;
   - `AboutPage` and `Person` markup that matches visible content.
6. Add `ContactPage` markup to Contact and ensure the public NAP matches authoritative profiles. Add CIN only from official company records supplied by the owner.

**Exit criteria:** GBP is complete and tracked; at least two authoritative directory profiles are complete; the entity graph contains official profiles; no fabricated awards, numbers, or ratings appear.

### Days 15–35: upgrade two money pages before writing more blogs

**Owner: content + founder + engineering**

Priority 1: `/software-development-company-ahmedabad`  
Priority 2: `/services/custom-business-systems`

For each page, add only evidence the company can stand behind:

- a direct answer explaining buyer fit and non-fit;
- common modules and integration boundaries;
- a real discovery-to-launch process;
- honest budget bands and timeline ranges, if the owner approves them;
- build-versus-buy and custom-versus-SaaS comparisons;
- failure modes and risk controls;
- relevant screenshots, architecture diagrams, or anonymized workflow examples;
- named case-study links and verifiable outcomes;
- useful buyer FAQs in visible HTML. Add FAQ schema only when the Q&A is genuinely present; do not expect a rich result.

For the Ahmedabad page, emphasize real local relevance: office/service area, GBP link, review proof, availability, local case evidence, and why a buyer should choose CodingBull over a directory shortlist. Do not add repetitive neighborhood keyword blocks.

**Exit criteria:** both pages answer commercial intent completely, contain first-party proof, have clear conversions, and are internally linked from relevant case studies and insights.

### Days 29–60: build two proof-led topic clusters

**Owner: founder/editor**

Do not choose the e-commerce article as the “quick win” until query-to-page data confirms it is the ranking URL. Select at most two clusters:

1. **Custom business systems / workflow automation**—already showing impressions and directly aligned to a service page.
2. **Healthcare operations software**—CodingBull has the strongest visible case-study and technical evidence here.

For the best three to five existing posts:

- add original examples, diagrams, code/architecture decisions, cost drivers, timelines, and failure cases;
- quote real first-party experience only when it is true and attributable;
- add author credentials and editorial review information;
- cite authoritative external sources for legal, compliance, or market claims;
- link each post to one primary service page, one relevant case study, and one related guide;
- preserve publication dates; use a genuine modified date after the revision.

Publish no more than one new evidence-dense article every two weeks until distribution and authority improve. Eight existing posts share `2026-05-27`; correct inaccurate dates from source records if available, but never fabricate staggered publication dates.

**Exit criteria:** three to five improved articles have unique diagrams or first-party proof, a clear query intent, and a distribution plan.

### Days 45–75: make case studies citation-worthy

**Owner: founder + client approver + content**

Upgrade the strongest two case studies with permissioned evidence:

- client problem and baseline;
- users, workflows, modules, and technical constraints;
- architecture or system diagram;
- screenshots with sensitive information removed;
- implementation decisions and tradeoffs;
- outcome metrics with a source or explicit qualitative wording when numbers are unavailable;
- named author, publication date, and update date.

Schema type is secondary. Keep `CreativeWork` if it is the truthful representation; use `Article` only when the visible page behaves like an authored editorial article.

### Days 60–90: distribution, citations, and pruning

**Owner: founder/marketing**

1. Distribute each strong asset through founder LinkedIn, the company page, GBP posts, relevant directory profile updates, and direct client/partner channels.
2. Seek a small number of relevant mentions: client partner pages, implementation partner listings, local technology associations, podcasts, and genuine expert contributions. Avoid bulk guest-post or directory packages.
3. Inspect pages that remain crawled-but-not-indexed after improvement. Merge, redirect, or remove pages that have no distinct intent or proof. The objective is not to index every URL; it is to index every valuable URL.
4. Auto-generate the current concise `llms.txt` from the canonical content registry so it cannot drift. Do not create `llms-full.txt` yet.
5. Add RSS and per-section OG templates only if the distribution workflow demonstrates a real use.

## Measurement plan

Track weekly, but judge directional search results in complete 28-day windows.

| Area | Metric | Definition |
|---|---|---|
| Technical | Priority canonical URLs indexed | Valuable service, location, case-study, and guide URLs indexed—not a raw sitemap quota |
| Search discovery | Non-brand impressions and clicks | GSC regex filter with the exact brand set documented; compare complete 28-day periods |
| Query ownership | Query → landing-page pairs | Filter a query first, then export Pages; never infer the pair from independent CSVs |
| Commercial visibility | Priority URLs receiving clicks | Count of priority service/location URLs with at least one organic click per 28 days |
| Local | GBP calls, website visits, direction requests, review count/rating | Use GBP performance and a consistent geographic rank check |
| Business | Qualified organic inquiries | Form/WhatsApp/call inquiries attributable to organic search and meeting buyer-fit criteria |
| GEO | AI-referred engaged sessions and assisted inquiries | Existing `AI_REFERRAL` classification, verified in the reporting layer |
| Authority | New authoritative profiles/mentions/reviews | Count only verified, relevant sources—not raw backlink volume |

### Realistic 30/60/90-day expectations

- **30 days:** exact coverage issues classified and fixed; GBP and entity profiles improved; two money-page briefs approved.
- **60 days:** two money pages and three evidence-led articles improved; priority pages indexed; non-brand impressions show directional improvement versus the preceding complete 28-day period.
- **90 days:** several commercial URLs earn recurring non-brand impressions and at least some clicks; local/GBP engagement improves; the first attributable qualified organic or AI-assisted inquiries may appear. Do not promise a local-pack position or page-one ranking in six to eight weeks at this authority level.

## Evidence still required before implementation decisions

1. GSC example URL lists for the three actionable coverage groups.
2. Query-filtered Pages exports for opportunity queries.
3. Current GBP completeness, categories, reviews, and performance export.
4. Verified company profiles and the official CIN, if the owner wants it public.
5. Client permission for names, screenshots, testimonials, and metrics.
6. A definition of a qualified lead and current analytics conversion events.

## Source and methodology notes

- Google documents that anonymized queries are omitted from Search Console tables while remaining in chart totals: [Search Console performance data](https://support.google.com/webmasters/answer/17011259?hl=en).
- Google recommends permanent server-side redirects and consistent canonical signals: [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects).
- Google states that AI search features need no special schema or AI-readable file beyond normal search fundamentals: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).
- Google’s FAQ rich-result change limits regular FAQ visibility mainly to authoritative government and health sites: [FAQ and HowTo changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes).
- Raw calculations and static article word counts are preserved in `analysis/codingbull-seo-gsc-audit-2026-07-26.ipynb`.
