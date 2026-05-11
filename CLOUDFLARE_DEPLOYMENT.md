# Cloudflare Pages Deployment Guide

This project runs entirely on Cloudflare Pages:
- **Frontend**: Static React app served from Cloudflare Pages
- **Backend API**: Cloudflare Pages Function at `functions/api/submit-contact-form.ts`
- **Email**: Resend (called server-side from the Pages Function)

## Prerequisites

1. A Cloudflare account with Pages enabled
2. A Resend account with `balustrading.co.nz` verified as a sending domain
3. A Google reCAPTCHA v2 site/secret key pair, with the production domain whitelisted

## Architecture Overview

```
┌─────────────────────┐
│  Cloudflare Pages   │  <- Static React frontend
│   (Frontend Host)   │
└──────────┬──────────┘
           │
           │ POST /api/submit-contact-form
           ▼
┌─────────────────────┐
│ Cloudflare Pages    │  <- functions/api/submit-contact-form.ts
│     Function        │     (verifies reCAPTCHA, calls Resend)
└──────────┬──────────┘
           │
           │ POST https://api.resend.com/emails
           ▼
┌─────────────────────┐
│      Resend         │  <- Email delivery
└─────────────────────┘
```

## Deployment Steps

### 1. Connect Your Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project** → **Connect to Git**
4. Choose your repository (`matthoppy/BalustradingConcepts-Website`)
5. Configure the build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave default)
   - **Node.js version**: 18 or later

Cloudflare Pages automatically detects and deploys the `functions/` directory
alongside the static build — no separate configuration is needed.

### 2. Configure Secrets in Cloudflare Pages

In **Settings → Environment variables / Secrets**, add the following for **both
Production and Preview** environments:

| Variable | Type | Value |
|---|---|---|
| `RESEND_API_KEY` | Secret | Your Resend API key (`re_...`) |
| `RECAPTCHA_SECRET_KEY` | Secret | Your Google reCAPTCHA v2 secret key |

These are server-only — they are bound to the Pages Function at request time
and are never exposed to the browser bundle. No `VITE_*` env vars are required
because the frontend posts to a same-origin path (`/api/submit-contact-form`).

### 3. reCAPTCHA Site Key

The reCAPTCHA **site key** is hard-coded in `src/components/Contact.tsx` and
`src/components/QuoteFormModal.tsx`. If you rotate keys, update those files
and ensure your production domain is whitelisted in the
[reCAPTCHA admin console](https://www.google.com/recaptcha/admin).

### 4. Deploy

Cloudflare Pages will automatically:
- Build the project on every push
- Deploy the static frontend
- Deploy the Pages Function under `/api/*`
- Create preview deployments for pull requests

### 5. Configure Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Add your custom domain (e.g. `balustrading.co.nz`)
3. Follow the DNS instructions
4. HTTPS is enabled automatically

## Project Structure

```
/
├── functions/
│   └── api/
│       └── submit-contact-form.ts   # Pages Function: reCAPTCHA + Resend
├── src/                              # React application (frontend)
│   ├── components/
│   │   ├── Contact.tsx               # Inline contact form
│   │   └── QuoteFormModal.tsx        # Modal version of the same form
│   └── pages/                        # Route pages
├── dist/                             # Build output (generated)
├── wrangler.toml                     # Cloudflare Pages config
└── package.json
```

## API Endpoint

### POST /api/submit-contact-form

Handles contact form submissions:
- Server-side reCAPTCHA verification against Google
- Email delivery via the Resend REST API
- Optional photo attachment (base64-encoded)

**Request body:**
```json
{
  "name": "John Doe",
  "phone": "09 123 4567",
  "email": "john@example.com",
  "message": "I'd like a quote...",
  "captchaToken": "03...",
  "photo": {
    "content": "base64-encoded-image",
    "filename": "project.jpg",
    "type": "image/jpeg"
  }
}
```

**Responses:**
- `200 { success: true }` — email queued with Resend
- `400 { error: "..." }` — invalid body or CAPTCHA failed
- `502 { error: "Failed to send email" }` — Resend rejected the request

## Local Development

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev` → http://localhost:8080

`npm run dev` serves only the static frontend. To test the Pages Function
locally, run the frontend behind Wrangler:

```bash
npm run build
npx wrangler pages dev dist --compatibility-date=2024-01-01
```

Then set the secrets locally:

```bash
npx wrangler pages secret put RESEND_API_KEY
npx wrangler pages secret put RECAPTCHA_SECRET_KEY
```

## Email Configuration

Emails are sent via Resend from the Pages Function:
- **From**: `Balustrading Concepts NZ <noreply@balustrading.co.nz>`
- **To**: `admin@balustrading.co.nz`
- **Subject**: `New Quote Request from [Name]`

To change these settings, edit `functions/api/submit-contact-form.ts` and
push — Cloudflare Pages will redeploy automatically.

## Troubleshooting

### Contact form not working
- Check the browser network tab — `/api/submit-contact-form` should return 200
- Confirm `RESEND_API_KEY` and `RECAPTCHA_SECRET_KEY` are set in Cloudflare Pages
- Check **Workers & Pages → your project → Functions → Logs** in Cloudflare for
  runtime errors
- Verify `balustrading.co.nz` is a verified sending domain in Resend

### CAPTCHA verification failed
- The reCAPTCHA site key in `Contact.tsx` / `QuoteFormModal.tsx` must match the
  secret in `RECAPTCHA_SECRET_KEY`
- The production domain must be whitelisted in the reCAPTCHA admin console

### Build failures
- Check build logs in the Cloudflare Pages dashboard
- Ensure Node.js version is 18 or later
- Confirm `package.json` and `package-lock.json` are in sync
