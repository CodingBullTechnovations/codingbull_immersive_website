# What to do next — plain language

> October 5 update: this July document is historical. Its indexing counts, missing-profile claims, causal explanations and timelines are not current verified findings. Use [the October 5 verification and owner steps](OCT-05-VERIFICATION-AND-OWNER-STEPS.md) before acting. Existing profiles are now present; do not create duplicates.

**Updated 2026-07-28. For Pranshu. No technical work left.**

---

## Where things stand

The website is finished and live. Everything that could be fixed in code has been fixed and verified.

Here is the honest situation in one paragraph:

**Google knows about 41 of your pages. It has only put 20 of them in its index.** The 21 it left out include **every single one of your 12 blog posts** and 7 of your 9 service pages. I checked those pages one by one on the live site. There is nothing wrong with them — they load fast, they are 4,000–6,600 words long, they are written correctly for search, and Google is allowed to read them. Google has looked at them and decided they are not worth adding yet.

**Why?** Because nobody outside your own website vouches for CodingBull. Google has almost no signals that you are a real, trusted business — no Google Business Profile, no directory listings, no reviews. When a website has thin trust, Google indexes the few most important pages and ignores the rest.

**So the remaining job is not building. It is proving you exist.** Everything below is that job.

---

## Do these in order

### 1. Google Business Profile — 30 minutes — DO THIS FIRST

This is the single highest-impact thing you can do. It is free.

Go to google.com/business and create a profile for CodingBull Technovations Pvt. Ltd.

- **Category:** Software company (add "Website designer" and "Computer consultant" as extra categories)
- **Description:** copy the GBP description from §5 of the handoff doc
- **Services:** copy the 9-item service list from §5
- **Website link — use exactly this** (the tracking tag tells you it came from Google):
  `https://www.codingbullz.com/software-development-company-ahmedabad?utm_source=google&utm_medium=organic&utm_campaign=gbp_ahmedabad`
- **Phone and email:** must match your website exactly, character for character
- Google will post a verification postcard or call. Complete that step — the profile does nothing until verified.

**Why first:** it is the only thing that can put you in the map results for "software company in Ahmedabad". You currently rank around position 57 for that search. A verified profile is how local businesses get found.

---

### 2. LinkedIn company page — 20 minutes

If CodingBull does not have a company page, create one. If it does, complete it fully.

- Use the same company description from §5 of the handoff doc
- Website link: `https://www.codingbullz.com/?utm_source=linkedin&utm_medium=social&utm_campaign=company_profile`
- Same phone, same city, same email as everywhere else

**Why:** it is a fast, free trust signal, and it is one of the first places Google and AI tools look to confirm a company is real.

---

### 3. Directory profiles — about 45 minutes each

Create free company profiles on these three, in this order:

1. **Clutch** (clutch.co)
2. **GoodFirms** (goodfirms.co)
3. **TechBehemoths** (techbehemoths.com)

For each one:
- Company description: §5 of the handoff doc
- Portfolio entries: the two prepared write-ups in §8 (Physioway and Shashwat IVF)
- Website link: use the matching UTM link from §5 — a different one per directory, so you can tell which directory sends you visitors

**Why these three:** when someone Googles "best software company in Ahmedabad", these directories occupy the top results — above every individual agency. Your competitors are not beating you with better websites. They are beating you by being listed here. AI tools like ChatGPT and Perplexity read these same directories when recommending companies.

**Important:** use identical company name, phone, city, and email on all of them. Inconsistent details weaken the signal instead of building it.

---

### 4. Ask three clients for reviews — 15 minutes to send

Message templates are ready in §6 of the handoff doc. Send to:

- **Physioway**
- **Shashwat IVF**
- **ANR Mechanicals**

Rules that matter — do not break these:
- Never offer money, discounts, or anything else in exchange for a review. Google and Clutch both remove reviews for this and can penalise the profile.
- Do not write the review for them or suggest wording. Ask for their honest words.
- Send the review link only after they say yes.

**Why this is the most valuable item:** reviews are the hardest signal to fake, so Google and AI tools weight them heavily. Three real reviews will do more for your trust score than another 20 blog posts.

---

### 5. Put your profile links back into the website — 5 minutes

Once the profiles above exist and are verified, log into your own admin panel:

**Admin → Settings → Social Links** — paste each URL and turn on **"Include in sameAs"**.

**Why:** this tells Google and AI systems "this website, this Google profile, this Clutch listing, and this LinkedIn page are all the same company." Right now your website makes no such claim, because every social link is blank. This is the step that connects everything you did in steps 1–4 back to your site.

Also on that screen: leave the **CIN field blank** unless you specifically want your company registration number public. Do not put the GST number in it.

---

## What to expect, and when

Be realistic. This is a trust-building process, not a switch.

| When | What you should see |
|---|---|
| **Week 1–2** | Google Business Profile verified and live. Nothing else visibly changes. |
| **Week 2–4** | Google recrawls your changed pages. `/ahmedabad` impressions may dip — that is expected and correct, because the commercial page is meant to take over that search. |
| **Week 4–8** | Directory profiles get indexed. Blog posts should begin entering the index. First appearance in map results for local searches. |
| **Week 8–12** | If reviews came in, meaningful movement on "software company in Ahmedabad". Non-branded clicks should start appearing. |

**Do not judge this in the first two weeks.** Check Search Console once a week, not daily. The numbers are small enough right now that daily changes are noise.

---

## What to watch in Search Console

Four things only:

1. **Total indexed pages** — currently 20 of 41. This going up is the single clearest sign the trust work is landing.
2. **Non-branded clicks** — searches that are not "coding bull" or "codebulls". You currently get almost none. This is the real business number.
3. **The two Ahmedabad pages** — `/software-development-company-ahmedabad` should gain impressions while `/ahmedabad` gives them up.
4. **Leads in your own admin panel** — you can now see which page and which visitor journey produced each inquiry, plus budget and timeline on every lead. That is the number that pays the bills; search rankings are only a means to it.

---

## Things NOT to do

- **Do not re-request validation on "Page with redirect" in Search Console.** Those 16 URLs are old links from your previous website that now correctly forward to new pages. Google marks that check as "Failed" for any deliberate redirect. It is working exactly as intended. Re-checking will fail again forever.
- **Do not request indexing repeatedly for the same pages.** It does not speed anything up and it wastes your daily quota.
- **Do not buy backlinks, directory bundles, or review packages.** This is precisely the situation where those offers look tempting. They cause manual penalties that are far harder to undo than the current slow start.
- **Do not publish new blog posts yet.** You already have 12 that Google refuses to index. Adding a 13th does not help. Fix trust first, then write again.
- **Never run `npm run db:seed:force` on the live server.** It would overwrite content you edited in the admin panel.

---

## Still waiting on you (only if you want these)

These were left undone on purpose because they need your decision or a client's permission:

- **Prices and timelines** beyond the ranges already published — approve them and they can go on the money pages. Competitors publish these, and it helps buyers decide.
- **Client permission** for screenshots, testimonials, or real measured results in the case studies.
- **A booking calendar link** if you want "Book a call" to become a tracked button.
- **The `?region=in` / `?region=us` / `?region=ae` old links** currently land on the homepage. They could point to your `/india`, `/usa`, `/uae` pages instead. Small benefit, small amount of work. Your call — low priority.
