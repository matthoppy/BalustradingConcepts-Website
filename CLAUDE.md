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
- Both POST JSON to `/api/submit-contact-form` (relative URL → same origin).
- Backend: **Cloudflare Pages Function** at `functions/api/submit-contact-form.ts`.
  - Verifies Cloudflare Turnstile token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
  - Sends email via Resend API.
- **Supabase is not used.** The form used to call a Supabase Edge Function; that was removed in commit `00bd09c`.

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
npx vitest run       # run tests once
npx tsc --noEmit     # type-check
npm run lint         # eslint
```

## Common pitfalls (learned the hard way)
- **"Page still shows reCAPTCHA after Turnstile migration"** → the custom domain wasn't attached to the new Pages project. Cloudflare Pages → project → Custom domains → add `www.balustrading.co.nz`. DNS pointing at Cloudflare IPs is not enough on its own.
- **"CAPTCHA verification failed" but the widget ticked** → `TURNSTILE_SECRET_KEY` missing/wrong on the Pages project, or the deployment hasn't been re-run since the env var was added. Always Retry deployment after touching env vars.
- **"Success toast but no email"** → check Resend → Logs and confirm sending domain `balustrading.co.nz` is verified.
