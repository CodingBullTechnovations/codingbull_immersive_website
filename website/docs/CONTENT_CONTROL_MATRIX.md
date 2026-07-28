# CodingBull Website Editing Guide (Non-Technical)

This guide explains what your team can update directly in Admin, and what still needs engineering support.

## 1) Three page ownership types

- **DB Controlled**  
  Meaning: this page content is managed from Admin.  
  Action: open the matching Admin section and edit there.

- **Mixed DB + Static**
  Meaning: Admin content is authoritative for fields that exist in the CMS, while code supplies fields the CMS does not model.
  Action: edit CMS-owned fields in Admin; request engineering changes for code-only enrichment.

- **Code Managed**  
  Meaning: this page is not editable in Admin yet.  
  Action: raise an engineering request with the exact page URL and required change.

## 2) What you can edit in Admin today

- Service detail pages: `/services/[service]`
- Insight detail pages: `/insights/[slug]`
- Case study detail pages: `/case-studies/[slug]`
- Testimonials, FAQs, media, leads, and settings

Main location:
- `Admin -> Services`
- `Admin -> Insights`
- `Admin -> Case Studies`
- `Admin -> Testimonials`
- `Admin -> FAQs`
- `Admin -> Settings`

## 3) Pages that still need code updates

- `/`
- `/about`
- `/contact`
- `/ahmedabad`
- `/software-development-company-ahmedabad`
- `/web-development-company-ahmedabad`
- `/india`
- `/usa`
- `/uae`
- `/canada`
- `/services` (index page)
- `/case-studies` (index page)
- `/privacy`
- `/terms`

These are listed in the Admin Content sidebar as **“Pages not controlled from admin.”**

## 3a) Detail-page ownership rules

- **Services:** DB-first for title, description, modules, FAQs, body, canonical, and SEO fields. Static code supplies technology lists and explicitly dated reviewed fallbacks. A narrow safety check blocks the already-rejected healthcare `40%` claim until the corrected DB content is synchronized; it does not override a normal Admin edit.
- **Insights:** DB-first. `updatedAt` is an internal record timestamp and is never published as editorial freshness. Visible `Updated`, `BlogPosting.dateModified`, and sitemap modification dates use only `contentUpdatedAt`, which changes when title, excerpt, or body changes.
- **Case studies:** DB-first for client, title, problem, solution, outcome, metrics, architecture, status, and permission. Code supplies richer fields not represented in the current CMS schema, such as modules, business value, roadmap, and page-specific CTA. Narrow safety checks reject the known old fabricated metrics and generic seeded architecture descriptions until DB synchronization is complete.
- **Publication control:** DB status remains authoritative. A DB row in draft/review/archive does not become public merely because a static fallback exists.

## 4) Common tasks (step-by-step)

### Update a service page
1. Open `Admin -> Services`.
2. Select the service.
3. Update title, description, modules, FAQs, and SEO fields.
4. Save and keep status as `PUBLISHED`.

### Hide a page from public without deleting it
1. Open the item in Admin.
2. Archive it (type `ARCHIVE` when prompted).
3. Confirm it no longer appears publicly.

### Restore an archived item
1. Open the same Admin section.
2. Click **Restore draft**.
3. Set status back to `PUBLISHED` when ready.

### Request a code-only page change
1. Copy the page URL.
2. Write what should change (headline, section, CTA, etc.).
3. Send to engineering as a single request with exact text.

## 5) Best-practice checklist for content team

- Keep titles specific and clear.
- Keep descriptions practical and buyer-focused.
- Use real outcomes in case studies.
- Do not publish placeholder text.
- Keep FAQs aligned with real client objections.
- If a page is code-managed, do not try to force it via another admin field.

## 6) Where to verify status

- `Admin -> Dashboard -> Content control matrix`  
  Shows route ownership and whether each page is editable from Admin.

- `Admin -> Content` sidebar  
  Shows direct links for pages that still require code changes.
