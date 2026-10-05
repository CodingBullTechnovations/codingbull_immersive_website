# Hostinger SMTP for enquiry notifications

Lead notifications are sent by `src/lib/server/email.ts` using settings read **only from environment variables** (`src/lib/server/env.ts`). Nothing saved in Admin Settings is used for email. Without working settings, enquiries are still saved in **Admin → Leads**, and the delivery is recorded as `MANUAL / SKIPPED`.

Chosen sender and login mailbox: **pranshu@codingbullz.com** (Hostinger Email).

Hostinger's outgoing server for this setup is `smtp.hostinger.com`, port `465`, SSL, with the full email address as the username ([Hostinger: email configuration details](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)).

## How the runtime chooses a provider

1. **Resend first.** If `RESEND_API_KEY` is any non-empty string, Resend is tried first. That includes a value made only of spaces, because the runtime checks it as-is without trimming. SMTP runs only afterwards, and a failed Resend attempt is recorded as `FAILED` first.
2. **Then SMTP.** SMTP is used when `SMTP_HOST`, `SMTP_USER` and `SMTP_PASSWORD` are all present. SSL is enabled only when `SMTP_PORT` is exactly `465`. An unset port means 587.
3. **Sender.** The SMTP sender is `SMTP_FROM`, else `EMAIL_FROM`, else a built-in default (`hello@codingbullz.com`). An **empty** `SMTP_FROM=` still counts as set, so don't leave it blank. Skipped and Resend delivery records show `EMAIL_FROM`, so set it to the same mailbox to keep the records consistent.
4. **Recipient.** The recipient is `CONTACT_EMAIL`, else the built-in default `codingbullz@gmail.com`. Set it explicitly.

### If Resend is already configured: stop

If `npm run check:email` reports that `RESEND_API_KEY` is non-empty, **don't clear it as part of this setup.** A non-empty key means Resend is currently the active provider. The owner must first decide whether to keep Resend or replace it with Hostinger SMTP. Only change that key after an explicit decision.

## Keys required (server only)

The server's working directory for the site is `/var/www/codingbull_immersive_website/website`. These are the keys and values the check expects:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=pranshu@codingbullz.com
SMTP_PASSWORD="<mailbox password, typed privately by the owner>"
SMTP_FROM="CodingBull <pranshu@codingbullz.com>"
EMAIL_FROM="CodingBull <pranshu@codingbullz.com>"
CONTACT_EMAIL=pranshu@codingbullz.com
```

- **`CONTACT_EMAIL`** must be exactly one plain address, with no display name, commas, semicolons, spaces or line breaks. It can be another inbox you read every day.
- **Senders** (`SMTP_FROM`, `EMAIL_FROM`) must be one address, either bare or as `Name <address>`. Commas, semicolons, line breaks and extra angle brackets are rejected.
- **The password** is typed by the owner directly into the file. Never put it in chat, tickets, shell history or commits.

### Passwords containing `$`, `#` or quotes

Next.js expands `$NAME` inside `.env*` files as a reference to another variable. A `$` that is part of the actual value must be escaped as `\$` ([Next.js: Referencing other variables](https://nextjs.org/docs/app/guides/environment-variables#referencing-other-variables)). An unescaped `$` silently changes the password the app sees.

Wrap the password in double quotes, so that `#` isn't treated as the start of a comment. `npm run check:email -- --verify` tests the password **after** the same loading and expansion, so it catches a wrong escape.

### Editing the file safely (merge, never truncate)

`.env.local` may or may not exist on the server. If it exists, it may hold other production settings such as the database, auth and encryption keys. Never overwrite it, and never redirect output into it with `>`.

```
cd /var/www/codingbull_immersive_website/website
umask 077
if [ -f .env.local ]; then
  backup=".env.local.bak-$(date +%Y%m%d-%H%M%S)"
  cp .env.local "$backup" && chmod 600 "$backup"
else
  touch .env.local            # creates an empty file; never truncates an existing one
fi
chmod 600 .env.local
grep -cE '^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASSWORD|SMTP_FROM|EMAIL_FROM|CONTACT_EMAIL|RESEND_API_KEY)=' .env.local   # count only, prints no values
nano .env.local
```

In the editor:
- Change existing lines in place, and add missing keys once at the end. Keep **one** line per key.
- Don't `echo` the password on the command line, because it would be saved in shell history.
- Don't commit `.env.local` or any backup. Delete the backup once email is confirmed working.

### Which value wins

`next start` loads production files in this order: `.env.production.local`, `.env.local`, `.env.production`, `.env`. The first file that defines a key wins. **Variables already present in the process environment win over every file**, including anything exported in the shell or set in a PM2 ecosystem `env` block. See [Next.js environment variable load order](https://nextjs.org/docs/app/guides/environment-variables#environment-variable-load-order).

`npm run check:email` always loads the files in production mode, even if your shell has `NODE_ENV=test`. It prints the file **names** it loaded. If a key you just set still fails, look for the same key in `.env.production.local` or in the PM2 environment.

## PM2 working directory

The files are read relative to where the site runs. Check that PM2's working directory is `website/`:

```
pm2 describe codingbull-website | grep -E 'exec cwd|script path|script args'
```

`exec cwd` must be `/var/www/codingbull_immersive_website/website`. If it isn't, fix the PM2 start configuration first.

## Check, then apply

1. **Offline check.** No network; prints no values:
   ```
   npm run check:email
   ```
2. **Login check.** Connects and authenticates to Hostinger over SSL on 465, with certificate validation on and time limits on each step. It **sends no email**, and on failure reports only a category and error code:
   ```
   npm run check:email -- --verify
   ```
3. **Apply by restarting.** Email settings are read at runtime, so **no rebuild and no `setup:db` or seed** is needed:
   ```
   pm2 restart codingbull-website --update-env
   ```
4. **End-to-end test.** Submit one clearly marked test enquiry on the live site, then check **Admin → Leads**. You should see one new lead with a delivery record of `SMTP / SENT`.
   - `SENT` only means Hostinger's SMTP server **accepted** the message for delivery. It doesn't prove it reached an inbox.
   - Confirm the message actually arrived in the `CONTACT_EMAIL` inbox, and check spam too.
   - `SMTP / FAILED` stores the reason. Fix it, then restart again.

## Rollback

If you made a backup, restore it. If `.env.local` didn't exist before, remove only the lines you added. Then restart:

```
cp .env.local.bak-YYYYMMDD-HHMMSS .env.local && chmod 600 .env.local
pm2 restart codingbull-website --update-env
```

## Notes

- Before relying on SMTP, run `npm audit --omit=dev`. The July 2026 audit listed advisories in the `nodemailer` chain. Upgrade deliberately; don't use `npm audit fix --force`.
- Whether mail lands in the inbox also depends on the domain's SPF/DKIM/DMARC records in Hostinger DNS. Re-check them in hPanel if test emails go to spam.
- This setup doesn't change login, the seed script, or how enquiries are saved.
