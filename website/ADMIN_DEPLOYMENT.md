# CodingBull Admin Deployment

## Required Runtime

- Node.js `20.19+` or `22.12+` on the VPS.
- PostgreSQL database reachable through `DATABASE_URL`.
- HTTPS reverse proxy in front of `next start`.

## Required Environment

Copy `.env.example` into the production environment and set real values for:

- `DATABASE_URL`
- `AUTH_SECRET`
- `RESEND_API_KEY` or SMTP variables
- `CONTACT_EMAIL`
- `EMAIL_FROM`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Database Commands

Use Prisma commands only:

```bash
npx prisma generate
npx prisma migrate dev --name init_admin_growth
npx prisma migrate deploy
npx prisma db seed
```

For the first admin user, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` before running the seed command.

## Production Checks

```bash
npm run lint
npm run build
curl -I https://www.codingbullz.com/admin
curl https://www.codingbullz.com/robots.txt
curl https://www.codingbullz.com/sitemap.xml
curl https://www.codingbullz.com/api/health
```

Admin pages must return `X-Robots-Tag: noindex, nofollow` and should redirect unauthenticated users to `/admin/login`.
