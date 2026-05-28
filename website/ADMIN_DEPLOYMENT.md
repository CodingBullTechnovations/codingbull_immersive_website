# CodingBull Website Deployment

## Required Runtime

- Node.js `20.19+` or `22.12+` on the VPS.
- PostgreSQL database reachable through `DATABASE_URL`.
- HTTPS reverse proxy in front of `next start`.

## Local PostgreSQL Setup In pgAdmin 4

Use an isolated database and role for this project:

- Database: `codingbull_website`
- Login role: `codingbulldb`
- Manual password: the password chosen in pgAdmin

In pgAdmin 4:

1. Right-click `Login/Group Roles` and choose `Create` -> `Login/Group Role`.
2. Set `General` -> `Name` to `codingbulldb`.
3. Set `Definition` -> `Password` to the manual password.
4. Set `Definition` -> `Connection limit` to `20`.
5. Set `Privileges` -> `Can login` to `Yes`.
6. Keep `Superuser`, `Create database`, and `Create role` as `No`.
7. Save the role.
8. Right-click `Databases` and choose `Create` -> `Database`.
9. Set `Database` to `codingbull_website` and `Owner` to `codingbulldb`.
10. Open Query Tool on `codingbull_website` and run:

```sql
ALTER SCHEMA public OWNER TO codingbulldb;
GRANT CONNECT ON DATABASE codingbull_website TO codingbulldb;
GRANT USAGE, CREATE ON SCHEMA public TO codingbulldb;
GRANT ALL PRIVILEGES ON SCHEMA public TO codingbulldb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO codingbulldb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO codingbulldb;
```

If the password contains special characters, URL-encode it in `DATABASE_URL`. For example, `@` becomes `%40`.

## Required Environment

Set these values in local `.env.local` and in the VPS environment. Do not commit real secrets.

- `DATABASE_URL`
- `AUTH_SECRET`
- `CREDENTIAL_ENCRYPTION_KEY` recommended for encrypted admin-stored credentials
- `RESEND_API_KEY` or SMTP variables
- `CONTACT_EMAIL`
- `EMAIL_FROM`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Optional server fallbacks only; prefer saving these in `/admin/settings` because admin credentials are encrypted and can be changed without redeploying:

- `GA4_MEASUREMENT_ID` or legacy `NEXT_PUBLIC_GA_ID`
- `GOOGLE_SEARCH_CONSOLE_SITE_URL`
- `GA4_PROPERTY_ID` if GA4 Data API imports are used
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`

Example database URL shape:

```env
DATABASE_URL="postgresql://codingbulldb:url-encoded-password@127.0.0.1:5432/codingbull_website"
```

## Password Reset

To reset the database password later in pgAdmin, open the `codingbulldb` role properties, set a new password in the `Definition` tab, save, update `DATABASE_URL`, and restart the app.

SQL equivalent:

```sql
ALTER ROLE codingbulldb WITH PASSWORD 'NEW_PASSWORD';
```

## Database Commands

Use Prisma commands only. Development creates migrations; production deploys committed migrations.

```bash
npx prisma generate
npx prisma migrate dev --name init_admin_growth
npx prisma migrate deploy
npx prisma db seed
```

For VPS deployments, do not run `migrate dev`; run:

```bash
npm ci
npm run setup:db
npm run lint
npm run build
sudo systemctl restart codingbull-website
```

`npm run setup:db` runs Prisma generate, migration deploy, full content/admin seed, and a database smoke test. It is safe to run repeatedly.

## Advanced SEO Data

The admin dashboard has first-party visitor tracking built in. Search query/ranking data will remain empty until Google Search Console is connected and data is imported.

Required Google setup:

1. Verify `https://www.codingbullz.com/` in Google Search Console.
2. Submit `https://www.codingbullz.com/sitemap.xml`.
3. Create a GA4 web stream and save `GA4.measurement_id` in `/admin/settings`.
4. Link GA4 with Search Console inside GA4 Admin.
5. In `/admin/settings`, save Google OAuth client credentials, Search Console site URL, GA4 property ID, then click `Connect Google OAuth`.
6. Use `Sync Search Console` and `Sync GA4` in admin, or schedule `npm run sync:seo` on the VPS.

Manual fixture import endpoint for verified admin users:

```http
POST /api/admin/seo/import
Content-Type: application/json
```

```json
{
  "searchConsole": [
    {
      "date": "2026-05-27",
      "query": "healthcare software development",
      "page": "/services/healthcare-software-development",
      "country": "IND",
      "device": "DESKTOP",
      "clicks": 4,
      "impressions": 120,
      "ctr": 0.0333,
      "averagePosition": 8.4
    }
  ],
  "ga4": [
    {
      "date": "2026-05-27",
      "landingPage": "/services/healthcare-software-development",
      "source": "google",
      "medium": "organic",
      "sessions": 20,
      "engagedSessions": 14,
      "users": 18,
      "conversions": 2
    }
  ]
}
```

## Production Checks

```bash
npm run lint
npm run build
curl https://www.codingbullz.com/api/health
curl -I https://www.codingbullz.com/admin
curl https://www.codingbullz.com/robots.txt
curl https://www.codingbullz.com/sitemap.xml
curl https://www.codingbullz.com/llms.txt
```

Admin pages must return `X-Robots-Tag: noindex, nofollow` and should redirect unauthenticated users to `/admin/login`.

`/api/health` must return `{"ok":true,"database":"ok"}` before launch.
