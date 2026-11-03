# Balustrading Concepts Website

## Stack
Vite + React 18 + TypeScript + Tailwind + shadcn-ui (Radix). Vitest + jsdom for tests.

## Hosting
- **Cloudflare Pages** — project name `balustradingconcepts-website`.
- Production URL: `https://www.balustrading.co.nz`. Apex `balustrading.co.nz` 301-redirects to `www`.
- Auto-deploys from the `main` branch on every push.
- The previous GitHub Pages workflow was removed (PR #17). The site is no longer served from GitHub Pages.

## Contact form architecture
- Frontend entry points:
  - `src/components/Contact.tsx` (main contact section)
  - `src/components/QuoteFormModal.tsx` (CTA modal)
  - `src/components/HeatPumpQuoteForm.tsx` (heat pump covers page)
- All POST JSON to `/api/submit-contact-form` (relative URL → same origin): the contact details, a plain-text `message`, `captchaToken`, plus `kind` (`balustrade` | `heatpump`), `source` and a `fields` object with every form field by name.
- Backend: **Cloudflare Pages Function** at `functions/api/submit-contact-form.ts` (logic in `functions/_lib/enquiries.ts`).
  - Verifies Cloudflare Turnstile token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
  - Keeps the enquiry in D1 (`DB` binding) with the photo in KV (`FILES_KV`) for the admin dashboard; never fatal if unbound.
  - Emails the office via Resend (enquiry number in the subject, link to the dashboard) and sends the customer an acknowledgement.
- **Supabase is not used.** The form used to call a Supabase Edge Function; that was removed in commit `00bd09c`.

## Admin dashboard (`/admin`)
- Frontend in `src/admin/` (lazy-loaded from `App.tsx`); API is a Pages Function at `/admin-api/*` (`functions/admin-api/[[path]].ts` → `functions/_lib/admin.ts`). Deploys with the site, nothing to paste.
- GitHub sign-in (OAuth app, callback `https://www.balustrading.co.nz/admin-api/auth/github/callback`), allow-list `ALLOWED_LOGINS`, HttpOnly cookie session in D1.
- Pages: Overview, Enquiries (status flow new → contacted → survey → quoted → won/lost/closed, notes, history), Projects (gallery + page pictures, commits to the repo as the signed-in user), Site (Cloudflare), Google profile.
- Bindings in `wrangler.toml`: D1 `balustrading` as `DB`, KV `balustrading-files` as `FILES_KV`. Schema in `db/schema.sql`. Secrets listed in `docs/ADMIN_DASHBOARD.md`.
- `/admin?mock=1` runs on sample data, no server needed.

## Website photos
- All gallery and page pictures live under `public/images/site/` and are listed in `src/content/site-images.json` (read through `src/content/siteImages.ts`). `Gallery.tsx`, `Hero.tsx`, `About.tsx` and the page heroes read the manifest; do not import gallery photos from `src/assets` any more.
- The dashboard's Projects page edits the manifest and commits it; edit by hand only for bulk changes.

## CAPTCHA — Cloudflare Turnstile (not Google reCAPTCHA)
- Library: `@marsidev/react-turnstile`.
- Site key (public, safe to commit) hardcoded at `src/components/Contact.tsx:7` and `src/components/QuoteFormModal.tsx`: `0x4AAAAAADOAJJhmHWvuf7PX`.
- Secret key stored as Cloudflare Pages env var **`TURNSTILE_SECRET_KEY`** (type: Secret) on the `balustradingconcepts-website` project, Production environment.
- Allowed hostnames are configured in Cloudflare dashboard → Turnstile → the matching widget.
- **Env var changes require a redeploy**: Pages → Deployments → latest → ⋯ → Retry deployment. They don't apply to existing deployments.

## Email — Resend
- Pages env var: **`RESEND_API_KEY`** (Production).
- From: `Balustrading Concepts NZ <noreply@balustrading.co.nz>`
- To: `admin@balustrading.co.nz`
- `balustrading.co.nz` must be a verified sending domain in Resend (SPF + DKIM + DMARC records live on Cloudflare DNS).

## Working with deployments
- Cloudflare Pages deploys `main` automatically. Merging a PR to `main` is what ships changes.
- Direct `.pages.dev` URL for inspecting the latest production build: `https://balustradingconcepts-website.pages.dev` (Cloudflare bot challenge will 403 most automated fetchers; test in a real browser).

## Office details (rendered on contact page)
- Address: 661a Rosebank Road, Auckland, New Zealand.
- Map: embedded via simple `https://www.google.com/maps?q=...&output=embed` iframe (no API key needed). Hidden on mobile (`hidden md:block`).
- Hours: Mon–Fri 7:00 AM – 1:30 PM, Weekends Closed.

## Commands
```
npm install
npm run dev          # vite dev server
npm run build        # production build
npm test             # vitest, once (site components, functions, manifest)
npm run typecheck    # tsc for the site and for functions/
npm run lint         # eslint
npm run check        # everything CI runs, then the build
```
CI (`.github/workflows/ci.yml`) runs typecheck, lint of `src/admin src/content functions`, tests and the build on every PR.

## Common pitfalls (learned the hard way)
- **"Page still shows reCAPTCHA after Turnstile migration"** → the custom domain wasn't attached to the new Pages project. Cloudflare Pages → project → Custom domains → add `www.balustrading.co.nz`. DNS pointing at Cloudflare IPs is not enough on its own.
- **"CAPTCHA verification failed" but the widget ticked** → `TURNSTILE_SECRET_KEY` missing/wrong on the Pages project, or the deployment hasn't been re-run since the env var was added. Always Retry deployment after touching env vars.
- **"Success toast but no email"** → check Resend → Logs and confirm sending domain `balustrading.co.nz` is verified.
