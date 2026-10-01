# Add CodingBull's public profiles on the server

This Next.js/Prisma project does not use Django manage.py. The equivalent command is `npm run addbacklinks`, available from the repository root or website/ directory.

## Run in order

For the owner's server deployment procedure, after manually committing/pushing the reviewed files:

```sh
cd /var/www/codingbull_immersive_website
git pull
cd website
npm ci --include=dev
npm run setup:db
npm run addbacklinks -- --dry-run
npm run addbacklinks
npm run build
pm2 restart codingbull-website --update-env
pm2 save
```

Stop if a step fails. Development dependencies are included because Prisma and the build tools are needed on this server. Ensure setup:db, addbacklinks, build and PM2 use the same intended production database; Next's environment-file precedence can differ from Prisma's dotenv loader. Do not print credentials to check this. The addbacklinks step is an intentional profile sync, not required on every subsequent deployment: rerunning can restore a profile deliberately deleted in Admin.

After deploying the new script files to the server, from the repository root:

```sh
npm run addbacklinks -- --list
npm run addbacklinks -- --dry-run
npm run addbacklinks
```

`--list` requires no database and displays candidates. `--dry-run` reads the configured database and prints ADD/KEEP without writing. The normal command adds missing profiles to the existing `social.links` SiteSetting. Use the production DATABASE_URL in the server environment or website/.env.production; Next's existing production environment loader is used. No credentials are printed. Installed application dependencies and generated Prisma client are required. No migration or new package is needed.

## Profiles

- TechBehemoths: https://techbehemoths.com/company/codingbull-technovations-pvt-ltd — owner screenshot and public page reviewed.
- Clutch: https://clutch.co/profile/codingbull-technovations — production public page reviewed in Chrome, identifies CodingBull and links to www.codingbullz.com. Do not use vendor.clutch.co or staging.clutch.co.
- GoodFirms: https://www.goodfirms.co/company/codingbull-technovations-pvt-ltd — public page reviewed in Chrome, identifies CodingBull and links to codingbullz.com. Do not use myaccount.goodfirms.co.
- Pinterest: https://www.pinterest.com/codingbullz/ — exact URL supplied by owner. Screenshot shows domain claimed; that does not establish any incoming links from published Pins. Automated web fetch was unavailable.

These candidates are kept in website/scripts/public-profiles.json. The command does not fetch third-party URLs at runtime; it validates public profile URL structure. Future ownership, availability and any manifest edits need review. An optional `--pinterest https://www.pinterest.com/HANDLE/` selects a different candidate, but cannot overwrite a conflicting existing database link.

## Preservation and visibility

The command preserves existing links, embeds, visibility flags, descriptions and unknown setting fields. Existing equivalent profile URLs are kept under their current IDs. A conflicting stable ID with a different URL stops the whole transaction; correct it manually in Admin Settings after review. New entries have footer and Organization sameAs visibility enabled. Repeat runs with matching profiles make no writes. A serializable database transaction protects against concurrent edits; retry a failed transaction after resolving concurrency.

The existing footer and Organization schema read this setting, so there is no duplicate footer/schema implementation. A standalone command cannot invoke Next request-based revalidation. After applying, rebuild and restart using the existing deployment procedure and production database configuration so static pages include the profiles. Some ISR pages refresh later; do not depend on that for all routes. Check Admin Settings, footer links and page-source Organization sameAs. Existing hidden links remain hidden; change their visibility manually only if intended.

This operation adds outbound identity/profile links on your website. It does not create incoming backlinks, submit listings, fabricate reviews, change DNS or guarantee rankings/AI recommendations. Pinterest DNS verification is already separate from this command.

## Verification

`node website/scripts/check-backlinks.mjs` tests preservation, duplicate avoidance, dry-run no writes, idempotency, conflict handling and dashboard URL rejection with a mock database boundary.

On 2026-10-01, the command was tested against the existing local PostgreSQL database: preview added nothing; apply created the four profiles; repeat kept all four and preserved the entire saved setting, including updatedAt. The production build and all postbuild guards passed. The running local production server rendered all four footer anchors and Organization sameAs URLs. Admin Settings redirected to login as expected; authenticated settings UI remains an owner check. In Settings, look for the **Additional profiles** textarea: one line per profile, not separate directory rows or JSON. This project uses Next.js Admin, not Django.

Claude Desktop independently reviewed the command and deployment order through Computer Use without editing files. No production database changes, staging, commits, push or deployment were performed. Verify the server's admin field, footer links and page-source Organization sameAs after deployment.
