# Deployment (Vercel)

This site is a static Next.js App Router build with one Server Action. It runs on Vercel’s default Node.js runtime. No `vercel.json` / `vercel.ts` is needed.

## 1. Create the project

1. In Vercel, choose **Add New → Project** and import the GitHub repository.
2. Framework preset: **Next.js**. Leave the build command, output directory and install command at their defaults (`npm ci`, `next build`).
3. Node.js version: **24.x** (Project → Settings → Build and Deployment).
4. Deploy. The first deployment is a production deployment of `main`, and pull requests get preview deployments.

`.vercelignore` keeps `assets-src/`, `scripts/`, `docs/` and the test files out of the upload. The build only needs `src/`.

## 2. Environment variables

Set these under Project → Settings → Environment Variables. All are optional, and the site works without any of them.

| Variable | Production | Preview | Development | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<custom domain>` once the domain is live | leave empty | leave empty | Without it, production falls back to `VERCEL_PROJECT_PRODUCTION_URL`. Never set it on Preview: it does not enable indexing there (only `VERCEL_ENV=production` does), but canonicals would point at production |
| `RESEND_API_KEY` | Resend API key (sending access only) | optional, ideally a separate key | optional | Mark as **Sensitive** |
| `QUOTE_FROM_EMAIL` | e.g. `Mikey Mike’s website <quotes@yourdomain.com>` | same | same | Must be on a Resend-verified domain |
| `QUOTE_TO_EMAIL` | the owner’s inbox | a test inbox | a test inbox | Defaults to the business email in `src/lib/site.ts` |

Changing a variable needs a redeploy to take effect. `NEXT_PUBLIC_*` values are inlined at build time.

## 3. Email delivery (Resend)

Without Resend, the form never claims success. It tells the visitor nothing was sent and offers a prepared email, a copy button and the phone numbers. To turn on real delivery:

1. Create a Resend account and add the sending domain (e.g. `yourdomain.com`, or a subdomain such as `mail.yourdomain.com`).
2. Add the DNS records Resend shows (SPF/MX on the return-path subdomain, DKIM `TXT`), and wait for **Verified**.
3. Add a DMARC record if the domain has none, e.g. `_dmarc TXT "v=DMARC1; p=none; rua=mailto:<owner inbox>"`.
4. Create an API key with **Sending access** for that domain only.
5. Set `RESEND_API_KEY`, `QUOTE_FROM_EMAIL` (on the verified domain) and `QUOTE_TO_EMAIL` in Vercel, then redeploy.
6. Test: send a request from the production site. The success panel only appears after Resend returns a message id. Failures are logged as `[quote] delivery failed: …` in **Logs**.

The visitor’s email, when given, is set as `reply_to`, so the owner can reply directly.

## 4. Domain

1. Project → Settings → Domains → add the custom domain (e.g. `www.example.com` plus the apex redirecting to it).
2. Point DNS as Vercel instructs (an `A` record for the apex, a `CNAME` for `www`), or move nameservers to Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical origin and redeploy.
4. HSTS is sent as `max-age=63072000` without `includeSubDomains; preload`. Only add those (in `src/lib/csp.ts`) once **every** subdomain of the domain is served over HTTPS, because preload is hard to undo.

## 5. Indexing rules

| Deployment | robots meta | robots.txt | sitemap |
| --- | --- | --- | --- |
| Production (`VERCEL_ENV=production`) | `index, follow` | `Allow: /` + sitemap | yes |
| Preview | `noindex, nofollow` | `Disallow: /` | not referenced |
| Local build | `noindex, nofollow` | `Disallow: /` | not referenced |
| Local build with `NEXT_PUBLIC_SITE_URL` set | indexable (only for Lighthouse SEO checks) | | |

Canonical and `og:url` are set per page; the 404 page has none.

After launch, submit `https://<domain>/sitemap.xml` in Google Search Console and check one page in the Rich Results Test (Organization, FAQPage, BreadcrumbList).

## 6. Firewall rate limit

The Server Action has a best-effort in-memory limit (5 requests per 10 minutes per IP, per warm instance). For a hard limit, add a Vercel Firewall rule:

1. Project → **Firewall** → **Configure** → **New Rule**.
2. Name: `Quote form rate limit`.
3. If **Request Path** equals `/contact` **and** **Method** equals `POST`.
4. Then: **Rate Limit**, fixed window, **10 requests per 60 seconds** per IP; action **Deny** (429).
5. Save and **Publish**.

Server Actions post to the page URL, so `/contact` covers the form. Optionally turn on **Bot Protection** (challenge mode) under Firewall → Managed rules.

## 7. Analytics

1. Project → **Analytics** → Enable (Web Analytics).
2. Project → **Speed Insights** → Enable.

Both are already wired in (`@vercel/analytics`, `@vercel/speed-insights`), cookieless, and only load on Vercel. Locally their scripts 404, which is expected.

## 8. Pre-launch checklist

- [ ] Owner confirms the business name to display (“Mikey Mike’s” vs “HVAC & GC Services”).
- [ ] Owner confirms the inbox for requests (`mikeymikeshvac.construction@gmail.com` vs `info@mikeymikeshvac.com`).
- [ ] Owner confirms whether to state a town or service area (currently “Massachusetts” only).
- [ ] Owner reviews the Privacy page text.
- [ ] Resend domain verified and the three email variables set, **or** a decision to launch with the fallback only.
- [ ] Custom domain added; `NEXT_PUBLIC_SITE_URL` set; redeployed.
- [ ] Firewall rate-limit rule published; Analytics and Speed Insights enabled.
- [ ] On production: `curl -I https://<domain>/` shows the CSP and HSTS; `/robots.txt` allows and lists the sitemap.
- [ ] Send one real test request end to end and confirm it arrives.
- [ ] Search Console: domain verified, sitemap submitted.

## 9. Accepted risks

- **`'unsafe-inline'` in `script-src`.** Static App Router pages inline their RSC payload, and nonces would force every page to render dynamically. Mitigation: no user content is rendered into HTML, JSON-LD escapes `<`, and `object-src`, `base-uri` and `form-action` are locked.
- **In-memory rate limit.** Per instance and resets on cold start. Mitigation: the firewall rule above.
- **Bot heuristics.** Determined bots can wait 3 seconds and skip the honeypot. Every drop is logged (`[quote] dropped as likely bot: …`), so check logs for false positives after launch.
- **Dev-only advisory.** `braces` 3.0.3 (GHSA-vfj7-8cjw-p6xm) via `eslint-config-next`. No patched version exists, and it is not part of any deployed bundle.
- **ESLint 10.** Some bundled lint plugins (react, import, jsx-a11y) have not widened their peer ranges yet. Lint runs and passes; revisit if a plugin breaks.
