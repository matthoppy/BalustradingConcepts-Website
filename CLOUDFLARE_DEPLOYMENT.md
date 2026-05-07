# Cloudflare Pages Deployment Guide

This project deploys end-to-end on Cloudflare Pages:

- **Frontend**: static React app built by Vite, hosted on Cloudflare Pages
- **Backend**: a Cloudflare Pages Function (`functions/api/submit-contact-form.ts`) that verifies reCAPTCHA and sends email via Resend
- **Email**: Resend

## Architecture

```
┌────────────────────────────────┐
│       Cloudflare Pages         │
│ ┌──────────────┐ ┌───────────┐ │
│ │ Static React │ │  Pages Fn │ │
│ │  (Vite app)  │ │ /api/...  │ │
│ └──────────────┘ └─────┬─────┘ │
└──────────────────────┬─┴───────┘
                       │
                       ▼
                  ┌─────────┐
                  │ Resend  │
                  └─────────┘
```

The form posts to `/api/submit-contact-form` (same origin), so no CORS, no separate Supabase project, no extra hosting.

## Deployment

### 1. Connect the repo to Cloudflare Pages

1. Cloudflare Dashboard → Pages → **Create a project** → **Connect to Git**
2. Select `matthoppy/BalustradingConcepts-Website`
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 18 or later

Cloudflare auto-detects the `functions/` directory and bundles it as Pages Functions.

### 2. Configure environment variables

In the Cloudflare Pages project settings → **Environment variables**, set the following for **both Production and Preview**:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXX
```

These are server-side secrets used only by the Pages Function — they are never sent to the browser.

There are no required frontend (`VITE_*`) variables.

### 3. Custom domain (optional)

Pages project → **Custom domains** → add `balustrading.co.nz` and follow the DNS instructions.

## API

### `POST /api/submit-contact-form`

Request body:

```json
{
  "name": "John Doe",
  "phone": "09 123 4567",
  "email": "john@example.com",
  "message": "Multi-line summary of all form fields...",
  "captchaToken": "03AGdBq25...",
  "photo": {
    "content": "<base64>",
    "filename": "site.jpg",
    "type": "image/jpeg"
  }
}
```

`photo` is optional. The function verifies the reCAPTCHA token with Google, then sends a single email through Resend to `admin@balustrading.co.nz`. Returns `200 { success: true }` on success, or `4xx/5xx { error }` on failure.

## Local development

```bash
npm install
npm run dev          # Vite dev server on http://localhost:8080
```

The dev server only serves the frontend. To exercise the Pages Function locally use Wrangler:

```bash
npx wrangler pages dev dist --compatibility-date=2024-01-01
```

(after `npm run build`), with `RESEND_API_KEY` and `RECAPTCHA_SECRET_KEY` exported in your shell.

## Email configuration

Set in `functions/api/submit-contact-form.ts`:

- **From**: `Balustrading Concepts NZ <noreply@balustrading.co.nz>`
- **To**: `admin@balustrading.co.nz`
- **Subject**: `New Quote Request from <name>`
- **Reply-To**: the submitter's email

Edit that file and redeploy (push to the branch) to change any of these.

## Troubleshooting

### Form returns "Couldn't send your request"

1. Open the browser devtools network tab and resubmit — look at the response body from `/api/submit-contact-form`.
2. In Cloudflare Pages → your deployment → **Functions** tab, view the function invocation logs. Common causes:
   - `RESEND_API_KEY` not set in Pages env vars
   - `RECAPTCHA_SECRET_KEY` not set or wrong
   - Resend domain `balustrading.co.nz` not verified in the Resend dashboard

### reCAPTCHA failures

- The site key is hard-coded in `Contact.tsx` and `QuoteFormModal.tsx`. Make sure the deployed domain is on the allow list in the Google reCAPTCHA admin console.
- The secret key in Cloudflare must match the same reCAPTCHA site.
